import React from 'react';
import './styles.css';

const TextWithTags = ({ content }) => {
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

    return <div className="content-text">{renderContentWithTags(content)}</div>;
};

export default TextWithTags; 