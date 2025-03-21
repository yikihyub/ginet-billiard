'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, X, Loader2 } from 'lucide-react';
import { useFavoriteBilliard } from '@/app/mobile/_hooks/login/useFavoriteBilliard';

interface FavoriteBilliardFormProps {
  onComplete: () => void;
}

export function FavoriteBilliardForm({
  onComplete,
}: FavoriteBilliardFormProps) {
  const {
    mapRef,
    selectedStores,
    searchKeyword,
    searchResults,
    showResults,
    error,
    loading,
    setSearchKeyword,
    searchStores,
    addBilliardStore,
    removeStore,
    handleSubmit,
  } = useFavoriteBilliard(onComplete);

  return (
    <div className="flex flex-col bg-white">
      <div className="mt-8 flex-1 p-4">
        <div>
          <h2 className="text-xl font-bold">자주 가는 당구장</h2>
          <p className="text-xs text-gray-600">
            자주 방문하는 당구장을 등록해주세요. (최대 3개)
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="space-y-6">
            {/* 검색 */}
            <div className="relative space-y-2">
              <Label>당구장 검색</Label>
              <div className="flex gap-2">
                <Input
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="당구장 이름을 검색해주세요"
                  onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                  onKeyUp={(e) => e.key === 'Enter' && searchStores()}
                  className="h-14 border-0 bg-gray-100 p-4"
                />
                <Button
                  type="button"
                  onClick={searchStores}
                  disabled={loading}
                  className="h-14 w-24 bg-green-600"
                >
                  {loading ? (
                    <Loader2 className="h-14 w-14 animate-spin" />
                  ) : (
                    <Search className="h-14 w-14" />
                  )}
                </Button>
              </div>

              {/* 검색 결과 */}
              {showResults && searchResults.length > 0 && (
                <div className="no-scrollbar mt-1 h-[200px] w-full overflow-y-auto rounded-md border bg-white p-2 shadow-lg">
                  {searchResults.map((store) => (
                    <button
                      key={store.id}
                      type="button"
                      onClick={() => addBilliardStore(store)}
                      className="w-full rounded-md p-2 text-left hover:bg-gray-100"
                    >
                      <div className="font-medium">{store.name}</div>
                      <div className="text-sm text-gray-500">
                        {store.address}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 지도 */}
              <div ref={mapRef} className="h-64 w-full rounded-lg border" />
            </div>

            {/* 등록된 당구장 목록 */}
            {selectedStores.map((store, index) => (
              <div key={store.id} className="relative rounded-lg border p-4">
                <button
                  type="button"
                  onClick={() => removeStore(index)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="font-medium">{store.name}</div>
                <div className="text-sm text-gray-500">{store.address}</div>
              </div>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 flex gap-2 bg-white p-4">
            <Button
              type="button"
              variant="outline"
              className="h-14 w-full"
              disabled={loading}
            >
              이전
            </Button>
            <Button
              type="submit"
              className="h-14 w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
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
      </div>
    </div>
  );
}
