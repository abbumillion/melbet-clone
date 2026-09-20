import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const { email } = useAuth()

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
      <div className="bg-[#0f1a2e] border border-[#1e2a44] rounded-lg p-4 space-y-3">
        <div className="text-sm text-gray-400">Account</div>
        <div className="text-white">{email}</div>
      </div>
    </div>
  )
}
