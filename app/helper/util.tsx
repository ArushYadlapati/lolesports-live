import {JSX} from "react";

/**
 * Capitalize the first letter of a string.
 * Used for league names in Buttons
 *
 * @param word the word to capitalize
 */
export function capitalize(word : any) : string {
    word = word.toString();
    return word.substring(0, 1).toUpperCase() + word.substring(1);
}

export function getTooltip(text: string, scheme: any) {
    return (
        <span className="relative cursor-pointer">
            <span className="w-6 h-6 flex items-center justify-center text-base font-bold rounded-full border group"
                  style={{ color: scheme.background, backgroundColor: scheme.foreground, borderColor: scheme.foreground}}
            >
                ?
                <div style={{ backgroundColor: scheme.foreground }}
                     className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max max-w-xs text-xs
                     text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none"
                >
                    { text }
                </div>
            </span>
        </span>
    );
}

// Modified tooltip function with positioning support
export function getTooltipString(
    text: string,
    scheme: any,
    position: 'left' | 'right' = 'right'
): string {
    const isLeft = position === 'left';

    return `
        <span style="position: relative; display: inline-block;">
            <span style="
                width: 18px;
                height: 18px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                font-weight: bold;
                border-radius: 50%;
                border: 1px solid ${scheme.foreground};
                color: ${scheme.background};
                background-color: ${scheme.foreground};
                cursor: pointer;
                position: relative;
            " onmouseover="this.children[0].style.opacity=1" onmouseout="this.children[0].style.opacity=0">
                ?
                <div style="
                    position: absolute;
                    top: 50%;
                    ${isLeft ? 'right: 100%; margin-right: 8px;' : 'left: 100%; margin-left: 8px;'}
                    transform: translateY(-50%);
                    z-index: 10;
                    background-color: ${scheme.foreground};
                    color: white;
                    padding: 6px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    white-space: normal;
                    min-width: 140px;
                    max-width: 220px;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s ease;
                ">
                    ${text}
                </div>
            </span>
        </span>
    `;
}

import { useState } from 'react';

export function getTooltipHTML(
    text: string,
    scheme: any,
    position: 'left' | 'right' = 'right'
): JSX.Element {
    const [isHovered, setIsHovered] = useState(false);
    const isLeft = position === 'left';

    return (
        <span style={{ position: 'relative', display: 'inline-block' }}>
            <span
                style={{
                    width: '18px',
                    height: '18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    borderRadius: '50%',
                    border: `1px solid ${scheme.foreground}`,
                    color: scheme.background,
                    backgroundColor: scheme.foreground,
                    cursor: 'pointer',
                    position: 'relative',
                }}
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}
            >
                ?
                {isHovered && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            [isLeft ? 'right' : 'left']: '100%',
                            marginRight: isLeft ? '8px' : '0',
                            marginLeft: isLeft ? '0' : '8px',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            backgroundColor: scheme.foreground,
                            color: 'white',
                            padding: '6px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            whiteSpace: 'normal',
                            minWidth: '140px',
                            maxWidth: '220px',
                            opacity: isHovered ? 1 : 0,
                            pointerEvents: 'none',
                            transition: 'opacity 0.2s ease',
                        }}
                    >
                        {text}
                    </div>
                )}
            </span>
        </span>
    );
}
