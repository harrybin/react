import '@testing-library/jest-dom'; //adds assertion methods on dom elements like 'toBeInTheDocument'
import createFetchMock from 'vitest-fetch-mock';
import { vi } from 'vitest';
import * as useQueryModule from '@harrybin/react-common';
import { LoadDataPropsAsync, SuspendedPromise, SuspenseStatus } from '@harrybin/react-common';

const fetchMocker = createFetchMock(vi);
// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMocker.enableMocks();

vi.mock('react-intl', async () => {
    const reactIntl = (await vi.importActual('react-intl')) as any;
    const intlProvider = new reactIntl.IntlProvider(
        {
            locale: 'en',
            messages: [],
        },
        {}
    );
    return {
        ...reactIntl,
        useIntl: () => {
            return intlProvider.state.intl;
        },
    };
});

vi.mock('../src/configuration/configuration');

vi.mock('../src/configuration/configuration', async () => ({
    default: {
        env: {
            K8S_NAMESPACE: '',
            NAME: 'LOCAL',
            API_ENDPOINT: '',
            SERVICES_BASE_URL: 'http://localhost',
            THIRD_PARTY_SERVICE_BASE_URL: 'https://api.chucknorris.io',
        },
        name: 'TEST',
        settings: {},
    },
}));

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = (await vi.importActual('react-router-dom')) as any;
    return {
        ...actual,
        useNavigate: () => mockedUsedNavigate,
        useLocation: () => vi.fn(),
        matchPath: () => vi.fn(),
    };
});

vi.mock('notistack', async () => {
    const actual = (await vi.importActual('notistack')) as any;
    return {
        ...actual,
        useSnackbar: () => ({
            enqueueSnackbar: vi.fn(),
        }),
    };
});

vi.mock('@harrybin/react-common', async () => ({
    ...(await vi.importActual<object>('@harrybin/react-common')),
    useQuery: vi.fn(),
}));

export function mockUseQuery<T extends object>(mockData: T) {
    vi.spyOn(useQueryModule, 'useQuery').mockImplementation((_: LoadDataPropsAsync) =>
        mockSuspend<T>(Promise.resolve(mockData)).query()
    );
}

export function mockSuspend<T>(promise: Promise<T>): SuspendedPromise<T> {
    let status: SuspenseStatus = SuspenseStatus.Pending;
    let result: T;
    promise.then(
        (value) => {
            status = SuspenseStatus.Success;
            result = value;
        },
        (_err) => {
            status = SuspenseStatus.Error;
        }
    );

    return {
        query() {
            switch (status) {
                case SuspenseStatus.Pending:
                case SuspenseStatus.Error:
                    return undefined;
                case SuspenseStatus.Success:
                default:
                    return result;
            }
        },
    };
}
