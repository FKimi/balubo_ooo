import { render } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('<Button />', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<Button>Click me</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders correctly with variant outline', () => {
    const { container } = render(<Button variant="outline">Outline</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })
})
