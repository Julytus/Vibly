import React from 'react';
import './styles.css';

const ContentWithTags = ({ 
    content, 
    placeholder, 
    onChange, 
    onKeyDown,
    className = "form-control rounded",
    style = {}
}) => {
    const renderContentWithTags = (content) => {
        if (!content) return '';
        const words = content.split(/(\s+)/);
        
        return words.map((word, index) => {
            if (word.startsWith('#')) {
                return (
                    <span key={index} className="hashtag">
                        {word}
                    </span>
                );
            }
            return word;
        });
    };

    return (
        <div className="post-text w-100">
            <textarea
                className={className}
                placeholder={placeholder}
                style={{ 
                    border: 'none', 
                    resize: 'none', 
                    minHeight: '100px',
                    display: content ? 'none' : 'block',
                    ...style 
                }}
                value={content}
                onChange={onChange}
                onKeyDown={onKeyDown}
            />
            {content && (
                <div 
                    className={`${className} content-preview`}
                    style={{ 
                        border: 'none',
                        minHeight: '100px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        ...style
                    }}
                    onClick={() => {
                        const textarea = document.querySelector('textarea');
                        textarea.style.display = 'block';
                        textarea.focus();
                    }}
                >
                    {renderContentWithTags(content)}
                </div>
            )}
        </div>
    );
};

export default ContentWithTags; 