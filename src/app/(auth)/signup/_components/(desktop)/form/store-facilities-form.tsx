import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon, X, Loader2 } from 'lucide-react';

import { useStoreFacilities } from '@/hooks/login/useStoreFacilities';

import { StoreFacilitiesFormProps } from '@/types/(login)/store-facilities-info';

export function StoreFacilitiesForm({ onComplete }: StoreFacilitiesFormProps) {
  const {
    formData,
    errors,
    showError,
    uploading,
    setFormData,
    handlePriceChange,
    handlePriceImageChange,
    handleStoreImagesChange,
    removeStoreImage,
    handleSubmit,
  } = useStoreFacilities(onComplete);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">가격 및 시설 정보 입력</h1>
        <p className="mt-2 text-gray-600">
          가격 정보와 매장 사진을 등록해주세요.
        </p>
      </div>

      {showError && (
        <Alert variant="destructive">
          <AlertDescription>필수 항목을 모두 입력해주세요.</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* 가격 정보 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weekdayPrice">
              평일 가격 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="weekdayPrice"
              type="number"
              placeholder="평일 가격을 입력해주세요"
              value={formData.priceInfo.weekdayPrice}
              onChange={(e) =>
                handlePriceChange('weekdayPrice', e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weekendPrice">주말 가격</Label>
            <Input
              id="weekendPrice"
              type="number"
              placeholder="주말 가격을 입력해주세요"
              value={formData.priceInfo.weekendPrice}
              onChange={(e) =>
                handlePriceChange('weekendPrice', e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceNote">추가 가격 정보</Label>
            <Textarea
              id="priceNote"
              placeholder="시간대별 가격, 할인 정보 등을 입력해주세요"
              value={formData.priceNote}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priceNote: e.target.value }))
              }
            />
          </div>
        </div>

        {/* 가격표 이미지 업로드 */}
        <div className="space-y-2">
          <Label>
            가격표 이미지 <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('priceImage')?.click()}
              className="flex h-32 w-full flex-col items-center justify-center border-2 border-dashed"
            >
              {formData.priceImage ? (
                <div className="text-sm">{formData.priceImage.name}</div>
              ) : (
                <>
                  <ImageIcon className="mb-2 h-8 w-8" />
                  <span>가격표 이미지 업로드</span>
                </>
              )}
            </Button>
            <input
              id="priceImage"
              type="file"
              accept="image/*"
              onChange={handlePriceImageChange}
              className="hidden"
            />
          </div>
          {errors.priceImage && (
            <p className="text-sm text-red-500">{errors.priceImage}</p>
          )}
        </div>

        {/* 매장 사진 업로드 */}
        <div className="space-y-2">
          <Label>
            매장 사진 <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-4">
            {formData.storeImages.map((image, index) => (
              <div key={index} className="relative">
                <div className="flex h-32 w-full items-center justify-center rounded-lg border">
                  <div className="text-sm">{image.name}</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeStoreImage(index)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('storeImages')?.click()}
              className="flex h-32 w-full flex-col items-center justify-center border-2 border-dashed"
            >
              <ImageIcon className="mb-2 h-8 w-8" />
              <span>매장 사진 추가</span>
            </Button>
          </div>
          <input
            id="storeImages"
            type="file"
            accept="image/*"
            multiple
            onChange={handleStoreImagesChange}
            className="hidden"
          />
          {errors.storeImages && (
            <p className="text-sm text-red-500">{errors.storeImages}</p>
          )}
          <p className="text-sm text-gray-500">
            매장 전경, 내부 사진 등을 등록해주세요.
          </p>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full"
          // onClick={onPrev}
          disabled={uploading}
        >
          이전
        </Button>
        <Button type="submit" className="h-12 w-full" disabled={uploading}>
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            '완료'
          )}
        </Button>
      </div>
    </form>
  );
}
