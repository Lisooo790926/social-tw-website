import { expect } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Welcome } from '../../pages/Welcome'

jest.mock('@uidotdev/usehooks', () => ({
    useMediaQuery: jest.fn().mockReturnValue(true),
    useIsFirstRender: jest.fn().mockReturnValue(false),
}))

jest.mock('../../pages/Home/HomePostList', () => ({
    __esModule: true,
    default: () => <div>Mocked PostList</div>,
}))

jest.mock('../../pages/Welcome/ExamplePostsList', () => ({
    __esModule: true,
    default: () => <div>Mocked PostList</div>,
}))

test('Welcome should render', () => {
    render(
        <MemoryRouter>
            <Welcome />
        </MemoryRouter>,
    )
    // @ts-expect-error The property `toBeInTheDocument` should exist
    expect(screen.getByAltText('UniRep Logo')).toBeInTheDocument()
    // @ts-expect-error The property `toBeInTheDocument` should exist
    expect(screen.getByText('Unirep Social TW')).toBeInTheDocument()

    // ... Add more tests as needed ...
})
