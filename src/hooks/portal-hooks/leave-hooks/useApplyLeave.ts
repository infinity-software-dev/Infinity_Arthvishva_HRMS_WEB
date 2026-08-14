import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { portalLeaveService } from '@/services/employeeProtalServices/employee.leave.service';

interface UseApplyLeaveProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const useApplyLeave = ({ isOpen, onSuccess, onClose }: UseApplyLeaveProps) => {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [leaveCategory, setLeaveCategory] = useState('Casual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayPeriod, setHalfDayPeriod] = useState<'Morning' | 'Afternoon'>('Morning');
  const [reason, setReason] = useState('');
  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);

  // 1. Fetch available tokens when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchTokens = async () => {
        setLoadingTokens(true);
        try {
          const data = await portalLeaveService.getActiveTokens();
          setTokens(data || []);
        } catch {
          setTokens([]);
        } finally {
          setLoadingTokens(false);
        }
      };
      fetchTokens();
    }
  }, [isOpen]);

  // 2. Filter Active Paid & CompOff tokens
  const activePaidTokens = useMemo(() => 
    tokens.filter(t => t.leaveType === 'Paid' && t.status === 'Active'),
    [tokens]
  );

  const activeCompOffTokens = useMemo(() => 
    tokens.filter(t => t.leaveType === 'CompOff' && t.status === 'Active'),
    [tokens]
  );

  // 3. Balance Calculations
  const totalPaidBalance = useMemo(() => 
    activePaidTokens.reduce((acc, t) => acc + (t.value || 1), 0),
    [activePaidTokens]
  );

  const totalCompOffBalance = useMemo(() => 
    activeCompOffTokens.reduce((acc, t) => acc + (t.value || 1), 0),
    [activeCompOffTokens]
  );

  // 4. Calculate total requested days
  const totalDays = useMemo(() => {
    if (isHalfDay) return 0.5;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate, isHalfDay]);

  // 5. Category-specific tokens
  const requiresTokens = leaveCategory === 'Paid' || leaveCategory === 'CompOff';

  const relevantTokens = useMemo(() => {
    if (leaveCategory === 'Paid') return activePaidTokens;
    if (leaveCategory === 'CompOff') return activeCompOffTokens;
    return [];
  }, [leaveCategory, activePaidTokens, activeCompOffTokens]);

  const selectedTokenValueSum = useMemo(() => {
    return tokens
      .filter(t => selectedTokenIds.includes(t._id))
      .reduce((sum, t) => sum + (t.value || 1), 0);
  }, [tokens, selectedTokenIds]);

  // Handlers
  const handleCategoryChange = (category: string) => {
    setLeaveCategory(category);
    setSelectedTokenIds([]);
  };

  const toggleTokenSelection = (id: string) => {
    setSelectedTokenIds(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (val > endDate) setEndDate(val);
  };

  const resetForm = () => {
    setLeaveCategory('Casual');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
    setIsHalfDay(false);
    setHalfDayPeriod('Morning');
    setReason('');
    setSelectedTokenIds([]);
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for taking leave.");
      return;
    }

    if (totalDays <= 0) {
      toast.error("Invalid date range selected.");
      return;
    }

    if (requiresTokens && selectedTokenValueSum < totalDays) {
      toast.error(`Please select enough tokens. (Need: ${totalDays}, Selected: ${selectedTokenValueSum})`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        leaveCategory,
        startDate,
        endDate: isHalfDay ? startDate : endDate,
        totalDays,
        isHalfDay,
        halfDayPeriod: isHalfDay ? halfDayPeriod : '',
        reason: reason.trim(),
        consumedLedgerIds: requiresTokens ? selectedTokenIds : []
      };

      await portalLeaveService.applyLeave(payload);
      toast.success("Leave application submitted! 🚀");
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form: {
      leaveCategory,
      startDate,
      endDate,
      isHalfDay,
      halfDayPeriod,
      reason,
      selectedTokenIds,
      totalDays,
      requiresTokens,
      selectedTokenValueSum
    },
    balances: {
      totalPaidBalance,
      totalCompOffBalance,
      relevantTokens,
      loadingTokens
    },
    status: {
      submitting
    },
    actions: {
      setLeaveCategory: handleCategoryChange,
      setStartDate: handleStartDateChange,
      setEndDate,
      setIsHalfDay,
      setHalfDayPeriod,
      setReason,
      toggleTokenSelection,
      handleSubmit,
      resetForm
    }
  };
};