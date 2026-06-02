'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FoldingListProps {
  children: React.ReactNode;
  className?: string;
  itemType?: 'ol' | 'ul';
}

export function FoldingList({
  children,
  className = 'space-y-5',
  itemType = 'ol',
}: FoldingListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Tag = itemType;

  // Convert children to flat array to analyze count and apply slices
  const childrenArray = React.Children.toArray(children);
  const total = childrenArray.length;

  if (total <= 10) {
    return (
      <Tag className={className}>
        {children}
      </Tag>
    );
  }

  const threshold = total <= 20 ? 10 : 20;
  const visibleList = childrenArray.slice(0, threshold);
  const foldedList = childrenArray.slice(threshold);
  const hiddenCount = total - threshold;

  return (
    <div className="space-y-6">
      <Tag className={className}>
        {/* Render visible items */}
        {visibleList}
        
        {/* Render folded items, adding the hidden class when collapsed */}
        {foldedList.map((item, index) => {
          if (React.isValidElement(item)) {
            const element = item as React.ReactElement<{ className?: string }>;
            return React.cloneElement(element, {
              className: cn(
                element.props.className,
                !isExpanded && 'hidden'
              ),
            });
          }
          return item;
        })}
      </Tag>

      {/* Expand/Collapse Control Block */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 pb-2 bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200 mt-6">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-8 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer text-sm hover:shadow"
        >
          {isExpanded ? (
            <>
              Show Less Tools
              <svg className="w-4 h-4 transform rotate-180 transition-transform text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </>
          ) : (
            <>
              Show All {total} Tools
              <svg className="w-4 h-4 transition-transform text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </>
          )}
        </button>
        {!isExpanded && (
          <span className="text-xs text-slate-400 font-medium">
            Showing top {threshold} products. Click to show remaining {hiddenCount} tools.
          </span>
        )}
      </div>
    </div>
  );
}
