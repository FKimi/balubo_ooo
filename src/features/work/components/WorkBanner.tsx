"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface WorkBannerProps {
  url: string;
  title: string;
  previewData?: LinkPreviewData | null;
  bannerImageUrl?: string;
  useProxy?: boolean;
}

interface LinkPreviewData {
  title: string;
  description: string;
  image: string;
  url: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  imageType: string;
  icon: string;
  iconWidth: number;
  iconHeight: number;
  iconSize: number;
  iconType: string;
  siteName: string;
  locale: string;
}

export function WorkBanner({
  url,
  title,
  previewData: initialPreviewData,
  bannerImageUrl,
  useProxy = true,
}: WorkBannerProps) {
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(
    () => initialPreviewData || null,
  );
  const [isLoading, setIsLoading] = useState(
    () => !initialPreviewData && !bannerImageUrl,
  );
  const [hasError, setHasError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoadAttempts, setImageLoadAttempts] = useState(0);

  console.log("WorkBanner rendered with:", {
    url,
    title,
    hasInitialPreviewData: !!initialPreviewData,
    initialImageUrl: initialPreviewData?.image,
    bannerImageUrl,
    useProxy,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchPreview = async () => {
      if (!url || !isMounted) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/link-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!isMounted) return;
        const data = await response.json();

        if (response.ok && data.image) {
          setPreviewData(data);
        } else {
          setHasError(true);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Preview fetch error:", error);
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (bannerImageUrl) {
      setPreviewData({
        image: bannerImageUrl,
        title: title,
        description: "",
        url: url,
        imageWidth: 0,
        imageHeight: 0,
        imageSize: 0,
        imageType: "",
        icon: "",
        iconWidth: 0,
        iconHeight: 0,
        iconSize: 0,
        iconType: "",
        siteName: "",
        locale: "",
      });
      setIsLoading(false);
    } else if (initialPreviewData) {
      setPreviewData(initialPreviewData);
      setIsLoading(false);
    } else if (url) {
      fetchPreview();
    } else {
      setIsLoading(false);
      setHasError(true);
    }

    return () => {
      isMounted = false;
    };
  }, [
    url,
    bannerImageUrl,
    initialPreviewData?.image,
    title,
    initialPreviewData,
  ]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    const currentAttempts = imageLoadAttempts + 1;
    setImageLoadAttempts(currentAttempts);

    console.error(`Image load error (attempt ${currentAttempts}):`, {
      src: target.src,
      originalImageUrl: previewData?.image,
      useProxy,
      isProxyUrl: target.src.includes("/api/image-proxy"),
    });

    // プロキシが失敗した場合、直接URLを試す（1回目のエラーのみ）
    if (
      useProxy &&
      target.src.includes("/api/image-proxy") &&
      previewData?.image &&
      currentAttempts === 1
    ) {
      console.log("Trying direct URL after proxy failure:", previewData.image);
      target.src = previewData.image;
      return;
    }

    // 2回目のエラーまたは直接URLでのエラーの場合、フォールバックを表示
    console.log("Setting image error state after all attempts failed");
    setImageError(true);
    target.style.display = "none";
    const fallback = target.parentElement?.querySelector(".fallback-bg");
    if (fallback) {
      fallback.classList.remove("hidden");
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    console.log("Image loaded successfully:", {
      src: target.src,
      naturalWidth: target.naturalWidth,
      naturalHeight: target.naturalHeight,
    });
    setImageError(false);
    setImageLoadAttempts(0);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <svg
            className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <div className="text-gray-500 text-xs">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (hasError || !previewData?.image || imageError) {
    console.log("Showing fallback due to:", {
      hasError,
      hasImage: !!previewData?.image,
      imageError,
    });
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center p-4">
          <div className="w-16 h-16 bg-white rounded-lg shadow-lg mx-auto mb-2 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="text-gray-600 text-xs font-medium">作品</div>
        </div>
      </div>
    );
  }

  const imageUrl =
    useProxy && previewData.image
      ? `/api/image-proxy?url=${encodeURIComponent(previewData.image)}`
      : previewData.image;

  console.log("Rendering image with URL:", imageUrl);

  return (
    <div className="w-full h-full relative bg-gray-50">
      <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={title || previewData.title || "バナー画像"}
          fill
          sizes="100vw"
          className="object-contain"
          onError={handleImageError}
          onLoad={handleImageLoad}
          priority
        />
        <div className="fallback-bg hidden absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-lg shadow-sm mx-auto mb-2 flex items-center justify-center border border-gray-200">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">画像を読み込めませんでした</p>
          </div>
        </div>
        {/* 微細なグラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none"></div>
      </div>
    </div>
  );
}
