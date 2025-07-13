import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ContentTypeFormProps {
  contentType: string
  formData: any
  handleInputChange: (_field: string, _value: string) => void
  newTag: string
  setNewTag: (_value: string) => void
  addTag: () => void
  removeTag: (tag: string) => void
  newRole: string
  setNewRole: (_value: string) => void
  addRole: (_role: string) => void
  addCustomRole: () => void
  removeRole: (role: string) => void
  newCategory: string
  setNewCategory: (_value: string) => void
  addCategory: () => void
  removeCategory: (category: string) => void
}

// 記事・ライティング用フォーム
export function ArticleForm({ 
  formData, 
  handleInputChange: _handleInputChange, 
  newTag, 
  setNewTag, 
  addTag, 
  removeTag,
  newRole,
  setNewRole,
  addRole,
  removeRole
}: ContentTypeFormProps) {
  const articleRoles = ['執筆', '取材', '編集', '校正', '企画', 'SEO対策']

  return (
    <div className="space-y-6">
      {/* 役割セクション */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">役割</h3>
            <p className="text-xs text-gray-600">この作品での貢献内容</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {articleRoles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => addRole(role)}
              className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                formData.roles.includes(role)
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-800 shadow-sm'
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="カスタム役割"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <Button
            type="button"
            onClick={() => {
              if (newRole && !formData.roles.includes(newRole)) {
                addRole(newRole);
                setNewRole('');
              }
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 rounded-xl"
          >
            追加
          </Button>
        </div>

        {formData.roles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {formData.roles.map((role: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium border border-emerald-200"
              >
                {role}
                <button
                  type="button"
                  onClick={() => removeRole(role)}
                  className="ml-2 text-emerald-600 hover:text-emerald-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* タグセクション */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">タグ</h3>
            <p className="text-xs text-gray-600">キーワードやトピック</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="タグを追加"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
          <Button
            type="button"
            onClick={addTag}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 rounded-xl"
          >
            追加
          </Button>
        </div>

        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {formData.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium border border-amber-200"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-amber-600 hover:text-amber-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// デザイン用フォーム
export function DesignForm({ 
  formData, 
  handleInputChange: _handleInputChange, 
  newTag, 
  setNewTag, 
  addTag, 
  removeTag,
  newRole,
  setNewRole,
  addRole,
  removeRole
}: ContentTypeFormProps) {
  const designRoles = ['UI設計', 'UXデザイン', 'グラフィックデザイン', 'ブランディング', 'アートディレクション', 'プロトタイピング']

  return (
    <div className="space-y-6">
      {/* 役割セクション */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">役割</h3>
            <p className="text-xs text-gray-600">デザインでの貢献内容</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {designRoles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => addRole(role)}
              className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                formData.roles.includes(role)
                  ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-300 text-purple-800 shadow-sm'
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="カスタム役割"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
          <Button
            type="button"
            onClick={() => {
              if (newRole && !formData.roles.includes(newRole)) {
                addRole(newRole);
                setNewRole('');
              }
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 rounded-xl"
          >
            追加
          </Button>
        </div>

        {formData.roles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {formData.roles.map((role: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-200"
              >
                {role}
                <button
                  type="button"
                  onClick={() => removeRole(role)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* タグセクション */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">タグ</h3>
            <p className="text-xs text-gray-600">デザインキーワードやスタイル</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="タグを追加"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
          <Button
            type="button"
            onClick={addTag}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 rounded-xl"
          >
            追加
          </Button>
        </div>

        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {formData.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium border border-amber-200"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-amber-600 hover:text-amber-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 他のコンテンツタイプの基本フォーム（共通フォーム）
export function DefaultContentForm({ 
  formData, 
  handleInputChange: _handleInputChange, 
  newTag, 
  setNewTag, 
  addTag, 
  removeTag,
  newRole,
  setNewRole,
  addRole,
  removeRole
}: ContentTypeFormProps) {
  const _predefinedRoles = ['企画', '制作', '編集', 'ディレクション', 'プロデュース', 'マネジメント']

  return (
    <div className="space-y-6">
      {/* 役割セクション */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 002 2v6a2 2 0 01-2 2v2a2 2 0 002 2h4a2 2 0 002-2v-2a2 2 0 01-2-2V8a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">役割</h3>
            <p className="text-xs text-gray-600">あなたの貢献内容</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="役割を入力"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <Button
            type="button"
            onClick={() => {
              if (newRole && !formData.roles.includes(newRole)) {
                addRole(newRole);
                setNewRole('');
              }
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 rounded-xl"
          >
            追加
          </Button>
        </div>

        {formData.roles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {formData.roles.map((role: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200"
              >
                {role}
                <button
                  type="button"
                  onClick={() => removeRole(role)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* タグセクション */}
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">タグ</h3>
            <p className="text-xs text-gray-600">キーワードやトピック</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="タグを追加"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
          <Button
            type="button"
            onClick={addTag}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 rounded-xl"
          >
            追加
          </Button>
        </div>

        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {formData.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium border border-amber-200"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-amber-600 hover:text-amber-800"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 