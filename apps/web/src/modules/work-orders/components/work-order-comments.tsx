'use client';

import { useState } from 'react';
import { WorkOrderComment } from '../types/work-order.types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MessageSquare,
  Send,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface WorkOrderCommentsProps {
  comments: WorkOrderComment[];
  isLoading?: boolean;
  onAddComment: (content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  isPending?: boolean;
  currentUserId?: string;
}

export function WorkOrderComments({
  comments,
  isLoading,
  onAddComment,
  onDeleteComment,
  isPending,
  currentUserId,
}: WorkOrderCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sortedComments = [...(comments || [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <MessageSquare className="h-4 w-4" />
            <CardTitle className="text-base">Comentarios</CardTitle>
            <span className="text-sm text-muted-foreground">({comments?.length || 0})</span>
          </button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Add comment form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <Textarea
              placeholder="Agregar un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="resize-none min-h-[80px]"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={!newComment.trim() || isPending}
              >
                <Send className="h-4 w-4 mr-2" />
                Comentar
              </Button>
            </div>
          </form>

          {/* Comments list */}
          {isLoading ? (
            <CommentsSkeleton />
          ) : sortedComments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay comentarios</p>
              <p className="text-xs">Sé el primero en comentar</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-auto">
              {sortedComments.map((comment) => {
                const isOwnComment = currentUserId === comment.userId;
                return (
                  <div
                    key={comment.id}
                    className={cn(
                      'flex gap-3',
                      isOwnComment && 'flex-row-reverse'
                    )}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-xs">
                        {getInitials(comment.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        'flex-1 min-w-0',
                        isOwnComment && 'flex flex-col items-end'
                      )}
                    >
                      <div
                        className={cn(
                          'p-3 rounded-lg max-w-[85%]',
                          isOwnComment
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={cn(
                              'text-xs font-medium',
                              isOwnComment
                                ? 'text-primary-foreground/80'
                                : 'text-muted-foreground'
                            )}
                          >
                            {comment.userName}
                          </span>
                          <span
                            className={cn(
                              'text-xs',
                              isOwnComment
                                ? 'text-primary-foreground/60'
                                : 'text-muted-foreground/60'
                            )}
                          >
                            {comment.userRole}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                      </div>
                      <div
                        className={cn(
                          'flex items-center gap-2 mt-1 text-xs text-muted-foreground',
                          isOwnComment && 'flex-row-reverse'
                        )}
                      >
                        <span>{formatDate(comment.createdAt)}</span>
                        {isOwnComment && onDeleteComment && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => onDeleteComment(comment.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function CommentsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
