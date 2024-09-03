import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import LinkTool from '@editorjs/link';
import Warning from '@editorjs/warning';
import Marker from '@editorjs/marker';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import Paragraph from '@editorjs/paragraph';
import { PUBLIC_URL } from 'network/Constant';

const AppEditor = forwardRef(({ data, readOnly, isCollapsed }, ref) => {
    const editorRef = useRef(null);

    useEffect(() => {
        const editorInstance = new EditorJS({
            holder: 'editorjs',
            readOnly: readOnly,
            tools: {
                header: Header,
                checklist: Checklist,
                quote: Quote,
                list: List,
                image: {
                    class: ImageTool,
                    config: {
                        endpoints: {
                            byFile: `${PUBLIC_URL}/v1/files/upload`,
                            byUrl: `${PUBLIC_URL}/v1/files/fetchUrl`,
                        },
                    },
                },
                code: CodeTool,
                delimiter: Delimiter,
                inlineCode: InlineCode,
                linkTool: LinkTool,
                warning: Warning,
                marker: Marker,
                embed: Embed,
                table: Table,
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true,
                },
            },
            data: data || {
                time: new Date().getTime(),
                blocks: [
                    {
                        type: 'header',
                        data: {
                            text: 'Start to write us',
                            level: 3,
                        },
                    },
                    {
                        type: 'paragraph',
                        data: {
                            text: '...',
                        },
                    },
                ],
            },
        });

        editorRef.current = editorInstance;

        return () => {
            if (editorInstance && typeof editorInstance.destroy === 'function') {
                editorInstance.destroy();
            }
        };
    }, [data, readOnly]);

    useImperativeHandle(ref, () => ({
        save: async () => {
            if (editorRef.current) {
                try {
                    const savedData = await editorRef.current.save();
                    return savedData;
                } catch (error) {
                    console.error('Saving failed:', error);
                    return null;
                }
            }
        },
    }));

    return <div id="editorjs" className={`${isCollapsed ? 'full-width' : ''}`}></div>;
});

export default AppEditor;