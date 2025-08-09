'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { getMarketers } from './actions/getMarketers';
import MarketerUpsert from './components/MarketerUpsert';
import MarketerCard from './components/MarketerCard';

export default function MarketerManagementPage() {
  const [marketers, setMarketers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadMarketers = async () => {
    setLoading(true);
    try {
      const result = await getMarketers();
      if (result.ok) {
        setMarketers(result.marketers || []);
      }
    } catch (error) {
      console.error('Error loading marketers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load marketers on component mount
  useEffect(() => {
    loadMarketers();
  }, []);

  const filteredMarketers = marketers.filter(marketer => {
    const matchesSearch = marketer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marketer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marketer.phone?.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || marketer.marketerStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المسوقين</h1>
          <p className="text-gray-600 mt-2">إدارة بيانات المسوقين والموظفين المختصين بالتسويق</p>
        </div>
        <MarketerUpsert
          mode='new'
          title="إضافة مسوق جديد"
          description="يرجى إدخال بيانات المسوق الجديد"
          defaultValues={{
            name: '',
            email: '',
            phone: '',
            addressLabel: 'العمل',
            district: '',
            street: '',
            buildingNumber: '',
            floor: '',
            apartmentNumber: '',
            landmark: '',
            deliveryInstructions: '',
            password: '',
            sharedLocationLink: '',
            latitude: '',
            longitude: '',
            marketerLevel: 'JUNIOR',
            specialization: '',
            targetAudience: '',
            commissionRate: 10,
            performanceRating: 0,
            marketerStatus: 'ACTIVE',
          }} />
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="البحث بالاسم أو البريد الإلكتروني أو الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="حالة المسوق" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">جميع المسوقين</SelectItem>
            <SelectItem value="ACTIVE">نشط</SelectItem>
            <SelectItem value="INACTIVE">غير نشط</SelectItem>
            <SelectItem value="SUSPENDED">معلق</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={loadMarketers} disabled={loading} variant="outline">
          <Icon name="RefreshCw" size="sm" className={loading ? 'animate-spin' : ''} />
          تحديث
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">إجمالي المسوقين</p>
              <p className="text-2xl font-bold">{marketers.length}</p>
            </div>
            <Icon name="Users" size="lg" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">نشط</p>
              <p className="text-2xl font-bold">{marketers.filter(m => m.marketerStatus === 'ACTIVE').length}</p>
            </div>
            <Icon name="CheckCircle" size="lg" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">معلق</p>
              <p className="text-2xl font-bold">{marketers.filter(m => m.marketerStatus === 'SUSPENDED').length}</p>
            </div>
            <Icon name="AlertTriangle" size="lg" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">متوسط التقييم</p>
              <p className="text-2xl font-bold">
                {marketers.length > 0
                  ? (marketers.reduce((sum, m) => sum + (m.performanceRating || 0), 0) / marketers.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
            <Icon name="Star" size="lg" />
          </div>
        </div>
      </div>

      {/* Marketers Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      ) : filteredMarketers.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Users" size="xl" className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مسوقين</h3>
          <p className="text-gray-600">ابدأ بإضافة مسوق جديد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMarketers.map((marketer) => (
            <MarketerCard key={marketer.id} marketer={marketer} />
          ))}
        </div>
      )}
    </div>
  );
}
