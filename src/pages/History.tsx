import { useState } from 'react';
import { getHistory, deleteHistoryItem, clearHistory } from '../services/storage';
import type { HistoryItem } from '../types';
import { StreamOutput } from '../components/StreamOutput';

const typeLabels: Record<HistoryItem['type'], { label: string; icon: string; color: string }> = {
  'job-analyzer': { label: '岗位翻译', icon: '📋', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  'action-planner': { label: '行动规划', icon: '📝', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  'resume-coach': { label: '简历优化', icon: '📄', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  'interview-coach': { label: '面试练习', icon: '🎤', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  'all-in-one': { label: '求职一条龙', icon: '🚀', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
};

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-card p-6 mx-4 max-w-sm w-full shadow-xl">
        <p className="text-gray-900 dark:text-white mb-6 text-center">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
}

export function History() {
  const [history, setHistory] = useState<HistoryItem[]>(getHistory());
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'single'; id: string } | { type: 'all' } | null>(null);

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    setDeleteTarget(null);
  };

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
    setSelectedItem(null);
    setDeleteTarget(null);
  };

  const handleItemClick = (item: HistoryItem) => {
    setSelectedItem((prev) => prev?.id === item.id ? null : item);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="py-8">
      {/* 确认对话框 */}
      {deleteTarget && (
        <ConfirmDialog
          message={deleteTarget.type === 'all' ? '确定要清空所有历史记录吗？此操作不可撤销。' : '确定要删除这条记录吗？'}
          onConfirm={() => {
            if (deleteTarget.type === 'all') {
              handleClearAll();
            } else {
              handleDelete(deleteTarget.id);
            }
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          📁 历史记录
        </h1>
        {history.length > 0 && (
          <button
            onClick={() => setDeleteTarget({ type: 'all' })}
            className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          >
            清空全部
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <span className="text-4xl mb-4 block">📭</span>
          <p className="text-gray-600 dark:text-white">暂无历史记录</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            使用各个功能模块后，记录会自动保存在这里
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 列表 */}
          <div className="space-y-3">
            {history.map((item) => {
              const typeInfo = typeLabels[item.type];
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`glass-card p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedItem?.id === item.id ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${typeInfo.color}`}>
                          {typeInfo.icon} {typeInfo.label}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-200">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {item.title}
                      </h3>
                      {item.summary && (
                        <p className="text-sm text-gray-500 dark:text-gray-200 truncate mt-1">
                          {item.summary}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget({ type: 'single', id: item.id });
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 详情 */}
          <div className="glass-card p-6">
            {selectedItem ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeLabels[selectedItem.type].color}`}>
                      {typeLabels[selectedItem.type].icon} {typeLabels[selectedItem.type].label}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white mt-2">
                      {selectedItem.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-200">
                      {formatDate(selectedItem.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                  <StreamOutput content={selectedItem.content} />
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 py-12">
                <span className="text-4xl mb-4">👈</span>
                <p>点击记录查看详情</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
