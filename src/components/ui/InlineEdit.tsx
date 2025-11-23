import React, { useState, useRef, useEffect } from "react";
import { Check, X, Pencil } from "lucide-react";

interface InlineEditProps {
    value: string;
    onSave: (newValue: string) => Promise<void>;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    multiline?: boolean;
    maxLength?: number;
}

export const InlineEdit: React.FC<InlineEditProps> = ({
    value,
    onSave,
    placeholder = "クリックして編集",
    className = "",
    inputClassName = "",
    multiline = false,
    maxLength,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            // テキストエリアの場合、カーソルを最後に移動
            if (multiline) {
                const length = editValue.length;
                inputRef.current.setSelectionRange(length, length);
            }
        }
    }, [isEditing, multiline, editValue.length]);

    const handleSave = async () => {
        if (editValue.trim() === value.trim()) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            await onSave(editValue.trim());
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save:", error);
            // エラー時は元の値に戻す
            setEditValue(value);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !multiline) {
            e.preventDefault();
            handleSave();
        } else if (e.key === "Escape") {
            e.preventDefault();
            handleCancel();
        } else if (e.key === "Enter" && e.metaKey && multiline) {
            // Cmd+Enter で保存（multilineの場合）
            e.preventDefault();
            handleSave();
        }
    };

    if (!isEditing) {
        return (
            <div
                className={`group relative inline-flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors ${className}`}
                onClick={() => setIsEditing(true)}
            >
                <span className={editValue ? "" : "text-gray-400 italic"}>
                    {editValue || placeholder}
                </span>
                <Pencil className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        );
    }

    return (
        <div className={`flex items-start gap-2 ${className}`}>
            {multiline ? (
                <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSave}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={`flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${inputClassName}`}
                    rows={3}
                    disabled={isSaving}
                />
            ) : (
                <input
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSave}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={`flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
                    disabled={isSaving}
                />
            )}
            <div className="flex gap-1">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    title="保存"
                >
                    <Check className="w-4 h-4" />
                </button>
                <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="p-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                    title="キャンセル (Esc)"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// タグのインライン編集用コンポーネント
interface InlineTagEditProps {
    tags: string[];
    onSave: (newTags: string[]) => Promise<void>;
    placeholder?: string;
}

export const InlineTagEdit: React.FC<InlineTagEditProps> = ({
    tags,
    onSave,
    placeholder = "タグを追加",
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isAdding && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isAdding]);

    const handleAddTag = async () => {
        if (!newTag.trim()) {
            setIsAdding(false);
            return;
        }

        if (tags.includes(newTag.trim())) {
            setNewTag("");
            setIsAdding(false);
            return;
        }

        setIsSaving(true);
        try {
            await onSave([...tags, newTag.trim()]);
            setNewTag("");
            setIsAdding(false);
        } catch (error) {
            console.error("Failed to add tag:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveTag = async (tagToRemove: string) => {
        setIsSaving(true);
        try {
            await onSave(tags.filter(t => t !== tagToRemove));
        } catch (error) {
            console.error("Failed to remove tag:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        } else if (e.key === "Escape") {
            e.preventDefault();
            setNewTag("");
            setIsAdding(false);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <div
                    key={tag}
                    className="group inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                    <span>{tag}</span>
                    <button
                        onClick={() => handleRemoveTag(tag)}
                        disabled={isSaving}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-red-100 rounded-full"
                        title="削除"
                    >
                        <X className="w-3 h-3 text-red-600" />
                    </button>
                </div>
            ))}

            {isAdding ? (
                <div className="inline-flex items-center gap-1">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleAddTag}
                        placeholder={placeholder}
                        disabled={isSaving}
                        className="px-3 py-1 border border-blue-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleAddTag}
                        disabled={isSaving}
                        className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                        <Check className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => {
                            setNewTag("");
                            setIsAdding(false);
                        }}
                        disabled={isSaving}
                        className="p-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-3 py-1 border-2 border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                    + {placeholder}
                </button>
            )}
        </div>
    );
};
