import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError: () => void;
}

/**
 * The 3D reveal is decoration. If WebGL is unavailable, the context is lost, or the
 * lazy chunk fails to load, tear the overlay down and leave the static cover in place
 * rather than showing the user an error they cannot act on.
 */
export default class BookErrorBoundary extends Component<Props> {
  static getDerivedStateFromError() {
    return {};
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.warn('[book3d] falling back to the static cover:', error, info);
    }
    this.props.onError();
  }

  render() {
    return this.props.children;
  }
}
