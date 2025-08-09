"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useSWR from 'swr';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
  DrawerDescription
} from '@/components/ui/drawer';
import { Icon } from '@/components/icons/Icon';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function CategorySelect({ value, onChange, disabled }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; disabled: boolean }) {
  const { data, error, isLoading } = useSWR('/api/categories', fetcher);
  const categories = data?.categories || [];
  if (isLoading) return <div className="text-xs text-muted-foreground py-2">جاري تحميل الفئات...</div>;
  if (error) return <div className="text-xs text-destructive py-2">فشل تحميل الفئات</div>;
  return (
    <select
      id="search-category"
      className="h-11 w-full rounded-xl border-2 bg-background/80 pl-4 pr-4 text-sm transition-all duration-300"
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <option value="">اختر الفئة...</option>
      {categories.map((cat: any) => (
        <option key={cat.id} value={cat.slug}>{cat.name}</option>
      ))}
    </select>
  );
}

function SearchForm() {
  const [search, setSearch] = useState('');
  const [description, setDescription] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [category, setCategory] = useState('');
  const router = useRouter();
  const [fieldsDisabled, setFieldsDisabled] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldsDisabled(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (description.trim()) params.set('description', description.trim());
    if (priceMin.trim() && !isNaN(Number(priceMin))) params.set('priceMin', priceMin.trim());
    if (priceMax.trim() && !isNaN(Number(priceMax))) params.set('priceMax', priceMax.trim());
    if (category) params.set('category', category);
    router.push('/?' + params.toString());
    setFieldsDisabled(false);
  };

  return (
    <form id="searchbar-root" className="flex flex-col gap-3 w-full relative" onSubmit={handleSubmit} autoComplete="off">
      <div className="relative w-full">
        <Input
          id="search-name"
          type="text"
          placeholder="ابحث عن منتج..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 pl-12"
          disabled={fieldsDisabled}
        />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center p-2 pointer-events-none">
          <Icon name="Search" className="h-7 w-7 text-foreground" />
        </div>
      </div>
      <Input
        id="search-description"
        type="text"
        placeholder="وصف المنتج..."
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="flex-1"
        disabled={fieldsDisabled}
      />
      <div className="flex gap-2">
        <Input
          id="search-price-min"
          type="number"
          placeholder="السعر الأدنى..."
          value={priceMin}
          onChange={e => setPriceMin(e.target.value)}
          className="flex-1"
          disabled={fieldsDisabled}
        />
        <Input
          id="search-price-max"
          type="number"
          placeholder="السعر الأعلى..."
          value={priceMax}
          onChange={e => setPriceMax(e.target.value)}
          className="flex-1"
          disabled={fieldsDisabled}
        />
      </div>
      <CategorySelect value={category} onChange={e => setCategory(e.target.value)} disabled={fieldsDisabled} />
      <DrawerClose asChild>
        <Button type="submit" disabled={fieldsDisabled}>بحث</Button>
      </DrawerClose>
    </form>
  );
}

export default function SearchDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="p-2 rounded-lg hover:bg-accent/50 transition-colors z-50 duration-300">
          <Icon name="Search" className="h-7 w-7 text-foreground" />
          <span className="text-sm font-medium text-foreground/90 hover:text-foreground transition-colors duration-200">
            بحث المنتجات
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-xl mx-auto p-4">
        <DrawerDescription>اكتب للبحث عن المنتجات أو التصنيفات.</DrawerDescription>
        <DrawerTitle className="sr-only">بحث المنتجات</DrawerTitle>
        <SearchForm />
      </DrawerContent>
    </Drawer>
  );
}
