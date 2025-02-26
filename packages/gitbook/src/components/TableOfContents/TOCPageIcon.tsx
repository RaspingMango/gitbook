import { RevisionPage } from '@gitbook/api';

import { tcls } from '@/lib/tailwind';

import { PageIcon } from '../PageIcon';

/**
 * Styled page icon for the table of contents.
 */
export function TOCPageIcon({ page }: { page: RevisionPage }) {
    return (
        <PageIcon
            page={page}
            style={tcls(
                'text-base',
                'text-dark/6',
                'dark:text-light/6',
                'group-aria-current-page/toclink:text-tint',
                'group-aria-current-page/toclink:dark:text-tint-400',
                'shrink-0',
            )}
        />
    );
}
