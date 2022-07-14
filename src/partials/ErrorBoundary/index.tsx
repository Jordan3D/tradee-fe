import { Component, ReactElement } from 'react';
import { GlobalContext } from '../../state/context';

import { Error } from '../../page/Error';

type Props = Readonly<{
  children: ReactElement
}>;

type State = Readonly<{
  hasError: boolean;
}>;

class ErrorBoundary extends Component<Props, State> {
  static contextType = GlobalContext;
  context!: React.ContextType<typeof GlobalContext>;

  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(exception: Error): void {
    const { showErrorPage } = this.context;
    console.error(exception);
    showErrorPage();
  }

  static getDerivedStateFromError = () => ({ hasError: true });

  reload = () => {
    window.location.reload();
  };

  render() {
    const { children } = this.props;
    const { errorPageShown } = this.context;
    const { hasError } = this.state;

    if (hasError || errorPageShown)
      return (
        <Error
          helmetTitle={'Something happend'}
          backButtonHandler={this.reload}
        />
      );

    return children;
  }
}

export default ErrorBoundary
