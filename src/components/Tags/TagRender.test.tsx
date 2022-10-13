import { getByText, render, screen } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { Provider as ContextProvider } from '../../state/context';
import Wrapper from '../../tests/typings/Wrapper';
import TagRender from './TagRender';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../../store';

const AppWrapper: Wrapper = ({ children }): ReactElement => (
    <BrowserRouter>
        <ReduxProvider store={store}>
            <ContextProvider>
                {children}
            </ContextProvider>
        </ReduxProvider>
    </BrowserRouter>
);


describe('Tests for TagRender', () => {
    it('should render component', () => {
        const tagData: CustomTagProps = {
            label: 'a',
            value: '1a22',
            disabled: false,
            closable: true,
            onClose: () => { }
        }
        const customData = {
            color: '',
            map: { '1a22': { label: 'aa', content: 'some string' } }
        }
        const App = () => <>{TagRender(customData)(tagData)}</>;

        const { baseElement } = render(<App />, { wrapper: AppWrapper });

        expect(baseElement.querySelector('.customTag')).toBeTruthy();
    });

    it('should render component related to data', () => {
        const CONTENT = 'some string';
        const tagData: CustomTagProps = {
            label: 'a',
            value: '1a22',
            disabled: false,
            closable: true,
            onClose: () => { }
        }
        const customData = {
            color: '',
            map: { '1a22': { label: tagData.label, content: CONTENT} },
            isTest: true
        }
        const App = () => <>{TagRender(customData)(tagData)}</>;

        const { baseElement } = render(<App />, { wrapper: AppWrapper });
        const item = baseElement.querySelector('.note-item__title');
        const antTooltipContent = baseElement.querySelector('.ant-tooltip-content');


        expect(item).toHaveTextContent(tagData.label as string);
        expect(antTooltipContent).toHaveTextContent(CONTENT);
    });
});