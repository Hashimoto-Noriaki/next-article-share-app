import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Button } from './Button'

describe('Button', () => {
  it('子要素が表示される', () => {
    render(<Button>クリック</Button>)

    expect(
      screen.getByRole('button', { name: 'クリック' })
    ).toBeInTheDocument()
  })

  it('デフォルト（primary + fullWidth）のスタイルが付与される', () => {
    render(<Button>ボタン</Button>)

    const button = screen.getByRole('button')

    // baseStyle
    expect(button).toHaveClass('rounded-full')
    expect(button).toHaveClass('py-3')
    expect(button).toHaveClass('shadow')

    // primary variant
    expect(button).toHaveClass('bg-emerald-600')
    expect(button).toHaveClass('hover:bg-emerald-500')
    expect(button).toHaveClass('text-white')

    // fullWidth = true
    expect(button).toHaveClass('w-full')
  })

  it('secondary variant のスタイルが付与される', () => {
    render(<Button variant="secondary">ボタン</Button>)

    const button = screen.getByRole('button')

    expect(button).toHaveClass('bg-amber-500')
    expect(button).toHaveClass('hover:bg-amber-400')
  })

  it('slate variant のスタイルが付与される', () => {
    render(<Button variant="slate">ボタン</Button>)

    const button = screen.getByRole('button')

    expect(button).toHaveClass('bg-slate-500')
    expect(button).toHaveClass('hover:bg-slate-400')
  })

  it('fullWidth=false のとき w-full が付与されない', () => {
    render(<Button fullWidth={false}>ボタン</Button>)

    const button = screen.getByRole('button')

    expect(button).not.toHaveClass('w-full')
  })

  it('onClick が発火する', () => {
    const handleClick = jest.fn()

    render(<Button onClick={handleClick}>クリック</Button>)
    fireEvent.click(screen.getByRole('button', { name: 'クリック' }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('className でクラスが追加できる', () => {
    render(<Button className="custom-class">ボタン</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })
})
