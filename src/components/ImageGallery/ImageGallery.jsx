import React, { useEffect, useState } from 'react';
import { getPostImage } from '../../services/api';
import FsLightbox from 'fslightbox-react';
import './imggrid.css';

const ImageGallery = ({ imageUrls }) => {
    const [loadedImages, setLoadedImages] = useState([]);
    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadImages = async () => {
            if (imageUrls && imageUrls.length > 0) {
                try {
                    const imagePromises = imageUrls.map(url => getPostImage(url));
                    const loadedImageUrls = await Promise.all(imagePromises);
                    setLoadedImages(loadedImageUrls);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error loading post images:', error);
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        loadImages();

        return () => {
            loadedImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imageUrls]);

    const openLightboxOnSlide = (number) => {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: number
        });
    };

    if (isLoading) {
        return (
            <div className="image-loading-placeholder d-flex justify-content-center align-items-center p-3">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!loadedImages || loadedImages.length === 0) return null;

    // Render các layout khác nhau dựa trên số lượng ảnh
    const renderImageLayout = () => {
        if (loadedImages.length === 1) return renderSingleImage();
        if (loadedImages.length === 2) return renderTwoImages();
        if (loadedImages.length === 3) return renderThreeImages();
        if (loadedImages.length >= 4) return renderFourImages();
    };

    const renderSingleImage = () => (
        <div className="single-image-container mb-2">
            <a 
                href={loadedImages[0]}
                className="rounded"
                onClick={(e) => {
                    e.preventDefault();
                    openLightboxOnSlide(1);
                }}
            >
                <img 
                    src={loadedImages[0]} 
                    alt="post-image" 
                    className="img-fluid rounded w-100"
                    style={{ maxHeight: '500px', objectFit: 'cover' }}
                    loading="lazy"
                />
            </a>
            <FsLightbox
                toggler={lightboxController.toggler}
                sources={loadedImages}
                slide={lightboxController.slide}
            />
        </div>
    );

    const renderTwoImages = () => (
        <div className="d-grid gap-2 grid-cols-2 mb-2">
            {loadedImages.map((imageUrl, index) => (
                <a 
                    key={index}
                    href={imageUrl}
                    className="rounded"
                    onClick={(e) => {
                        e.preventDefault();
                        openLightboxOnSlide(index + 1);
                    }}
                >
                    <img 
                        src={imageUrl} 
                        alt={`post-image-${index}`} 
                        className="img-fluid rounded w-100 h-100"
                        style={{ objectFit: 'cover', height: '300px' }}
                        loading="lazy"
                    />
                </a>
            ))}
            <FsLightbox
                toggler={lightboxController.toggler}
                sources={loadedImages}
                slide={lightboxController.slide}
            />
        </div>
    );

    const renderThreeImages = () => (
        <div className="three-images mb-2">
            {loadedImages.map((imageUrl, index) => (
                <a 
                    key={index}
                    href={imageUrl}
                    className="rounded"
                    onClick={(e) => {
                        e.preventDefault();
                        openLightboxOnSlide(index + 1);
                    }}
                >
                    <img 
                        src={imageUrl} 
                        alt={`post-image-${index}`} 
                        className="img-fluid rounded"
                        loading="lazy"
                    />
                </a>
            ))}
            <FsLightbox
                toggler={lightboxController.toggler}
                sources={loadedImages}
                slide={lightboxController.slide}
            />
        </div>
    );

    const renderFourImages = () => {
        if (loadedImages.length === 4) {
            return (
                <div className="d-grid gap-2 grid-cols-2 mb-2">
                    {loadedImages.map((imageUrl, index) => (
                        <a 
                            key={index}
                            data-fslightbox="profile-gallery"
                            href={imageUrl}
                            className="rounded"
                            onClick={(e) => {
                                e.preventDefault();
                                openLightboxOnSlide(index + 1);
                            }}
                        >
                            <img 
                                src={imageUrl} 
                                alt="profile-image" 
                                className="img-fluid bg-info-subtle rounded image-size" 
                                loading="lazy"
                            />
                        </a>
                    ))}
                    <FsLightbox
                        toggler={lightboxController.toggler}
                        sources={loadedImages}
                        slide={lightboxController.slide}
                    />
                </div>
            );
        }

        // Xử lý trường hợp nhiều hơn 4 ảnh
        return (
            <div className="user-post mt-4">
                <div className="row">
                    {loadedImages.slice(0, 3).map((imageUrl, index) => (
                        <div key={index} className="col-md-4 mt-md-0 mt-3">
                            <a 
                                data-fslightbox="gallery" 
                                href={imageUrl}
                                className="rounded"
                                onClick={(e) => {
                                    e.preventDefault();
                                    openLightboxOnSlide(index + 1);
                                }}
                            >
                                <img 
                                    src={imageUrl} 
                                    alt={`post-image-${index}`} 
                                    className="img-fluid rounded w-100"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    loading="lazy"
                                />
                            </a>
                        </div>
                    ))}
                </div>
                <div className="row mt-3">
                    <div className="col-md-6">
                        <a 
                            data-fslightbox="gallery" 
                            href={loadedImages[3]}
                            className="rounded"
                            onClick={(e) => {
                                e.preventDefault();
                                openLightboxOnSlide(4);
                            }}
                        >
                            <img 
                                src={loadedImages[3]} 
                                alt="post-image-4" 
                                className="img-fluid rounded w-100"
                                style={{ height: '200px', objectFit: 'cover' }}
                                loading="lazy"
                            />
                        </a>
                    </div>
                    {loadedImages.length > 4 && (
                        <div className="col-md-6 mt-md-0 mt-3">
                            <div className="post-overlay-box h-100 rounded position-relative">
                                <img 
                                    src={loadedImages[4]} 
                                    alt="post-image-5" 
                                    className="img-fluid rounded w-100 h-100 object-cover"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    loading="lazy"
                                />
                                <a 
                                    data-fslightbox="gallery" 
                                    href={loadedImages[4]}
                                    className="overlay-content"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openLightboxOnSlide(5);
                                    }}
                                >
                                    <span className="font-size-18">+{loadedImages.length - 4}</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
                <FsLightbox
                    toggler={lightboxController.toggler}
                    sources={loadedImages}
                    slide={lightboxController.slide}
                />
            </div>
        );
    };

    return renderImageLayout();
};

export default ImageGallery; 