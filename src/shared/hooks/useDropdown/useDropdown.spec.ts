import { renderHook, act } from '@testing-library/react';
import { useDropdown } from './useDropdown';

describe('useDropdown', () => {
  it('初期状態はisOpenがfalse', () => {
    const { result } = renderHook(() => useDropdown());
    expect(result.current.isOpen).toBe(false);
  });

  it('toggleでisOpenがtrueになる', () => {
    const { result } = renderHook(() => useDropdown());
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('toggleを2回呼ぶとisOpenがfalseに戻る', () => {
    const { result } = renderHook(() => useDropdown());
    act(() => {
      result.current.toggle();
    });
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('closeでisOpenがfalseになる', () => {
    const { result } = renderHook(() => useDropdown());
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('外側クリックでisOpenがfalseになる', () => {
    const { result } = renderHook(() => useDropdown());

    // ref に実際の DOM 要素をセットする
    const div = document.createElement('div');
    document.body.appendChild(div);
    (result.current.ref as React.MutableRefObject<HTMLDivElement | null>).current = div;

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    expect(result.current.isOpen).toBe(false);

    document.body.removeChild(div);
  });
});
