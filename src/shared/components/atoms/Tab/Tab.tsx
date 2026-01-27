type Props = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

export function Tab({ label, isActive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-t-md font-medium text-sm ${
        isActive
          ? 'text-emerald-600 border-b-2 border-emerald-500'
          : 'text-slate-600 hover:text-slate-800'
      }`}
    >
      {label}
    </button>
  );
}
