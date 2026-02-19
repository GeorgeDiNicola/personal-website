type BackToTopButtonProps = {
  isDark: boolean;
};

export function BackToTopButton({ isDark }: BackToTopButtonProps) {
  return (
    <button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-4 bottom-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border text-xl font-bold shadow-lg transition md:right-6 md:bottom-6 ${
        isDark
          ? "border-slate-600 bg-slate-900/90 text-slate-100 hover:bg-slate-800"
          : "border-slate-300 bg-white/90 text-slate-900 hover:bg-slate-100"
      }`}
    >
      ^
    </button>
  );
}
