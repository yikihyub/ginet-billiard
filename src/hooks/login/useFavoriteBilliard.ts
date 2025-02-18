import { useState, useRef, useEffect } from 'react';
import { useForm } from '@/app/(auth)/signup/_components/(desktop)/context/sign-in-context';
import { loadKakaoMapsScript } from '@/lib/loadKakaoMap';

export function useFavoriteBilliard(onComplete: () => void) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    selectedStores,
    searchKeyword,
    searchResults,
    showResults,
    markers,
    mapInstance: map,
  } = state.favoriteStores;

  useEffect(() => {
    const initializeMap = async () => {
      try {
        await loadKakaoMapsScript();

        if (!mapRef.current) return;

        const kakaoMap = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        });

        dispatch({
          type: 'SET_FAVORITE_STORES',
          payload: {
            selectedStores: [], // 기존 값 유지
            searchKeyword: '', // 기존 값 유지
            searchResults: [], // 기존 값 유지
            showResults: false, // 기존 값 유지
            markers: [], // 기존 값 유지
            mapInstance: kakaoMap, // 새로운 값
          },
        });
      } catch (error) {
        console.error('지도 초기화 실패:', error);
        setError('지도를 불러오는데 실패했습니다.');
      }
    };

    initializeMap();
  }, [dispatch]);

  const setSearchKeyword = (keyword: string) => {
    dispatch({
      type: 'SET_FAVORITE_STORES',
      payload: { searchKeyword: keyword },
    });
  };

  const searchStores = async () => {
    if (!searchKeyword.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/store/allstore/${searchKeyword}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '검색 중 오류가 발생했습니다.');
      }

      if (data.length === 0) {
        setError('검색 결과가 없습니다.');
      } else {
        dispatch({
          type: 'SET_FAVORITE_STORES',
          payload: {
            searchResults: data,
            showResults: true,
          },
        });
      }
    } catch (error) {
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const addBilliardStore = (store: any) => {
    if (selectedStores.length >= 3) {
      setError('최대 3개의 당구장만 등록할 수 있습니다.');
      return;
    }

    if (selectedStores.some((s) => s.id === store.id)) {
      setError('이미 등록된 당구장입니다.');
      return;
    }

    const newMarkers = [...markers];
    if (map && store.latitude && store.longitude) {
      const markerPosition = new window.kakao.maps.LatLng(
        store.latitude,
        store.longitude
      );
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: map,
      });

      newMarkers.push(marker);
      map.setCenter(markerPosition);
    }

    dispatch({
      type: 'SET_FAVORITE_STORES',
      payload: {
        selectedStores: [...selectedStores, store],
        showResults: false,
        searchKeyword: '',
        markers: newMarkers,
      },
    });
  };

  const removeStore = (index: number) => {
    if (markers[index]) {
      markers[index].setMap(null);
    }

    dispatch({
      type: 'SET_FAVORITE_STORES',
      payload: {
        selectedStores: selectedStores.filter((_, i) => i !== index),
        markers: markers.filter((_, i) => i !== index),
      },
    });
  };

  const validateFavoriteStores = () => {
    if (selectedStores.length === 0) {
      setError('최소 한 개의 자주 가는 당구장을 등록해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateFavoriteStores()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInfo: state.userInfo,
          storeInfo: state.storeInfo,
          location: state.location,
          matching: state.matching,
          selectedStores: selectedStores,
          agree_terms: state.terms.terms,
          agree_privacy: state.terms.privacy,
          agree_location: state.matching.locationConsent,
        }),
      });

      console.log('userInfo:', state.userInfo);
      console.log('storeInfo:', state.storeInfo);
      console.log('location:', state.location);
      console.log('matching:', state.matching);
      console.log('selectedStores:', selectedStores);
      console.log(
        state.terms.terms,
        state.terms.privacy,
        state.matching.locationConsent
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '회원가입 중 오류가 발생했습니다.');
      }

      onComplete();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '회원가입 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
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
    validateFavoriteStores,
    setError,
    handleSubmit,
  };
}
