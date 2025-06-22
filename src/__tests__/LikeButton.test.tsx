import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LikeButton from '@/features/work/components/LikeButton'

// helper to create a resolved fetch response-like object
const createJsonResponse = (data: unknown) => ({
  ok: true,
  json: () => Promise.resolve(data),
}) as unknown as Response

describe('<LikeButton />', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    global.fetch = originalFetch
  })

  it('increments like count when clicked by authenticated user', async () => {
    // Prepare sequential fetch mocks: initial GET then POST
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(
        createJsonResponse({ count: 0, isLiked: false }) // for initial GET
      )
      .mockResolvedValueOnce(createJsonResponse({})) // for POST

    render(<LikeButton workId="work1" />)

    // initial state should show "いいね"
    expect(await screen.findByText('いいね')).toBeInTheDocument()

    const button = screen.getByRole('button')
    await userEvent.click(button)

    // After click optimistic update shows "1"
    expect(await screen.findByText('1')).toBeInTheDocument()

    // ensure fetch was called twice
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
