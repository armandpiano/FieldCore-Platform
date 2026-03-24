import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workOrdersService } from '../services/work-orders.service';
import {
  WorkOrderFilters,
  CreateWorkOrderRequest,
  UpdateWorkOrderRequest,
  AssignTechnicianRequest,
  ChangeStatusRequest,
  AddCommentRequest,
} from '../types/work-order.types';
import { toast } from 'sonner';

// Query keys
export const workOrderKeys = {
  all: ['work-orders'] as const,
  lists: () => [...workOrderKeys.all, 'list'] as const,
  list: (filters: WorkOrderFilters) => [...workOrderKeys.lists(), filters] as const,
  details: () => [...workOrderKeys.all, 'detail'] as const,
  detail: (id: string) => [...workOrderKeys.details(), id] as const,
  comments: (id: string) => [...workOrderKeys.detail(id), 'comments'] as const,
  evidence: (id: string) => [...workOrderKeys.detail(id), 'evidence'] as const,
  timeline: (id: string) => [...workOrderKeys.detail(id), 'timeline'] as const,
  technicians: () => ['technicians', 'available'] as const,
};

// Hook: List work orders
export function useWorkOrders(filters?: WorkOrderFilters) {
  return useQuery({
    queryKey: workOrderKeys.list(filters || {}),
    queryFn: () => workOrdersService.list(filters),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

// Hook: Get single work order
export function useWorkOrder(id: string) {
  return useQuery({
    queryKey: workOrderKeys.detail(id),
    queryFn: () => workOrdersService.getById(id),
    enabled: !!id,
  });
}

// Hook: Create work order
export function useCreateWorkOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateWorkOrderRequest) => workOrdersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      toast.success('Orden de servicio creada exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Error al crear la orden');
    },
  });
}

// Hook: Update work order
export function useUpdateWorkOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateWorkOrderRequest }) =>
      workOrdersService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      toast.success('Orden actualizada exitosamente');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Error al actualizar la orden');
    },
  });
}

// Hook: Delete work order
export function useDeleteWorkOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => workOrdersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      toast.success('Orden eliminada');
    },
    onError: () => {
      toast.error('Error al eliminar la orden');
    },
  });
}

// Hook: Assign technician
export function useAssignTechnician() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AssignTechnicianRequest }) =>
      workOrdersService.assignTechnician(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: workOrderKeys.timeline(id) });
      toast.success('Técnico asignado exitosamente');
    },
    onError: () => {
      toast.error('Error al asignar técnico');
    },
  });
}

// Hook: Change status
export function useChangeStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ChangeStatusRequest }) =>
      workOrdersService.changeStatus(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: workOrderKeys.timeline(id) });
      toast.success('Estado actualizado');
    },
    onError: () => {
      toast.error('Error al cambiar estado');
    },
  });
}

// Hook: Start service
export function useStartService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => workOrdersService.startService(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      toast.success('Servicio iniciado');
    },
    onError: () => {
      toast.error('Error al iniciar servicio');
    },
  });
}

// Hook: Mark arrival
export function useMarkArrival() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, latitude, longitude }: { id: string; latitude?: number; longitude?: number }) =>
      workOrdersService.markArrival(id, latitude, longitude),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.detail(id) });
      toast.success('Llegada registrada');
    },
    onError: () => {
      toast.error('Error al registrar llegada');
    },
  });
}

// Hook: Complete service
export function useCompleteService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      workOrdersService.completeService(id, comment),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      toast.success('Servicio completado');
    },
    onError: () => {
      toast.error('Error al completar servicio');
    },
  });
}

// Hook: Get comments
export function useWorkOrderComments(workOrderId: string) {
  return useQuery({
    queryKey: workOrderKeys.comments(workOrderId),
    queryFn: () => workOrdersService.getComments(workOrderId),
    enabled: !!workOrderId,
  });
}

// Hook: Add comment
export function useAddComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddCommentRequest }) =>
      workOrdersService.addComment(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.comments(id) });
      queryClient.invalidateQueries({ queryKey: workOrderKeys.timeline(id) });
    },
    onError: () => {
      toast.error('Error al agregar comentario');
    },
  });
}

// Hook: Delete comment
export function useDeleteComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workOrderId, commentId }: { workOrderId: string; commentId: string }) =>
      workOrdersService.deleteComment(workOrderId, commentId),
    onSuccess: (_, { workOrderId }) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.comments(workOrderId) });
    },
    onError: () => {
      toast.error('Error al eliminar comentario');
    },
  });
}

// Hook: Get evidence
export function useWorkOrderEvidence(workOrderId: string) {
  return useQuery({
    queryKey: workOrderKeys.evidence(workOrderId),
    queryFn: () => workOrdersService.getEvidence(workOrderId),
    enabled: !!workOrderId,
  });
}

// Hook: Upload evidence
export function useUploadEvidence() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      id,
      file,
      type,
      description,
      latitude,
      longitude,
    }: {
      id: string;
      file: File;
      type: 'photo' | 'signature' | 'document' | 'video';
      description?: string;
      latitude?: number;
      longitude?: number;
    }) => workOrdersService.uploadEvidence(id, file, type, description, latitude, longitude),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.evidence(id) });
      queryClient.invalidateQueries({ queryKey: workOrderKeys.timeline(id) });
      toast.success('Evidencia subida exitosamente');
    },
    onError: () => {
      toast.error('Error al subir evidencia');
    },
  });
}

// Hook: Delete evidence
export function useDeleteEvidence() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workOrderId, evidenceId }: { workOrderId: string; evidenceId: string }) =>
      workOrdersService.deleteEvidence(workOrderId, evidenceId),
    onSuccess: (_, { workOrderId }) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.evidence(workOrderId) });
    },
    onError: () => {
      toast.error('Error al eliminar evidencia');
    },
  });
}

// Hook: Get timeline
export function useWorkOrderTimeline(workOrderId: string) {
  return useQuery({
    queryKey: workOrderKeys.timeline(workOrderId),
    queryFn: () => workOrdersService.getTimeline(workOrderId),
    enabled: !!workOrderId,
  });
}

// Hook: Get available technicians
export function useAvailableTechnicians(date?: string) {
  return useQuery({
    queryKey: [...workOrderKeys.technicians(), date || 'all'],
    queryFn: () => workOrdersService.getAvailableTechnicians(date),
    staleTime: 60000, // 1 minute
  });
}

// Hook: Cancel work order
export function useCancelWorkOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      workOrdersService.cancel(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
      toast.success('Orden cancelada');
    },
    onError: () => {
      toast.error('Error al cancelar orden');
    },
  });
}

// Combined hook for work order management
export function useWorkOrderManagement(workOrderId: string) {
  const queryClient = useQueryClient();
  
  const workOrder = useWorkOrder(workOrderId);
  const comments = useWorkOrderComments(workOrderId);
  const evidence = useWorkOrderEvidence(workOrderId);
  const timeline = useWorkOrderTimeline(workOrderId);
  
  const changeStatus = useChangeStatus();
  const addComment = useAddComment();
  const uploadEvidence = useUploadEvidence();
  const startService = useStartService();
  const markArrival = useMarkArrival();
  const completeService = useCompleteService();
  
  const refetchAll = () => {
    queryClient.invalidateQueries({ queryKey: workOrderKeys.detail(workOrderId) });
    queryClient.invalidateQueries({ queryKey: workOrderKeys.comments(workOrderId) });
    queryClient.invalidateQueries({ queryKey: workOrderKeys.evidence(workOrderId) });
    queryClient.invalidateQueries({ queryKey: workOrderKeys.timeline(workOrderId) });
  };
  
  return {
    workOrder,
    comments,
    evidence,
    timeline,
    changeStatus,
    addComment,
    uploadEvidence,
    startService,
    markArrival,
    completeService,
    refetchAll,
  };
}
