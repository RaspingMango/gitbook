import { Space } from '@gitbook/api';
import { Icon } from '@gitbook/icons';
import { headers } from 'next/headers';
import React from 'react';

import { getChangeRequest, getRevision, SiteContentPointer } from '@/lib/api';
import { tcls } from '@/lib/tailwind';

import { RefreshChangeRequestButton } from './RefreshChangeRequestButton';
import { Toolbar, ToolbarBody, ToolbarButton, ToolbarButtonGroups } from './Toolbar';
import { DateRelative } from '../primitives';

interface AdminToolbarProps {
    content: SiteContentPointer;
    space: Space;
}

function ToolbarLayout(props: { children: React.ReactNode }) {
    return (
        <div
            className={tcls(
                'fixed',
                'bottom-5',
                'left-1/2',
                'z-50',
                'transform',
                '-translate-x-1/2',
                'rounded-full',
                'bg-dark-1/9',
                'shadow-lg',
                'min-h-10',
                'min-w-40',
                'p-2',
                'max-w-md',
                'border-dark-1',
                'backdrop-blur-sm',
            )}
        >
            <React.Suspense fallback={null}>{props.children}</React.Suspense>
        </div>
    );
}

/**
 * Toolbar with information for the content admin when previewing a revision or change-request.
 */
export async function AdminToolbar(props: AdminToolbarProps) {
    const { content } = props;
    const mode = await headers().get('x-gitbook-mode');

    if (mode === 'multi-id') {
        // We don't show the admin toolbar in multi-id mode, as it's used for previewing in the dashboard.
        return null;
    }

    if (content.changeRequestId) {
        return (
            <ChangeRequestToolbar
                spaceId={content.spaceId}
                changeRequestId={content.changeRequestId}
            />
        );
    }

    if (content.revisionId) {
        return <RevisionToolbar spaceId={content.spaceId} revisionId={content.revisionId} />;
    }

    return null;
}

async function ChangeRequestToolbar(props: { spaceId: string; changeRequestId: string }) {
    const { spaceId, changeRequestId } = props;

    const changeRequest = await getChangeRequest(spaceId, changeRequestId);

    if (!changeRequest) {
        return null;
    }

    return (
        <ToolbarLayout>
            <Toolbar>
                <ToolbarButton title="Open in application" href={changeRequest.urls.app}>
                    <Icon icon="code-branch" className="size-4" />
                </ToolbarButton>
                <ToolbarBody>
                    <p>
                        #{changeRequest.number}: {changeRequest.subject ?? 'No subject'}
                    </p>
                    <p className="text-xs text-light/8 dark:text-light/8">
                        Change request updated <DateRelative value={changeRequest.updatedAt} />
                    </p>
                </ToolbarBody>
                <ToolbarButtonGroups>
                    <ToolbarButton title="Open in application" href={changeRequest.urls.app}>
                        <Icon icon="arrow-up-right-from-square" className="size-4" />
                    </ToolbarButton>
                    <RefreshChangeRequestButton
                        spaceId={spaceId}
                        changeRequestId={changeRequestId}
                        revisionId={changeRequest.revision}
                        updatedAt={new Date(changeRequest.updatedAt).getTime()}
                    />
                </ToolbarButtonGroups>
            </Toolbar>
        </ToolbarLayout>
    );
}

async function RevisionToolbar(props: { spaceId: string; revisionId: string }) {
    const { spaceId, revisionId } = props;

    const revision = await getRevision(spaceId, revisionId, {
        metadata: true,
    });

    return (
        <ToolbarLayout>
            <Toolbar>
                <ToolbarButton title="Open in application" href={revision.urls.app}>
                    <Icon icon="code-commit" className="size-4" />
                </ToolbarButton>
                <ToolbarBody>
                    <p>
                        Revision created <DateRelative value={revision.createdAt} />
                    </p>
                    {revision.git ? (
                        <p className="text-xs text-light/8 dark:text-light/8">
                            {revision.git.message}
                        </p>
                    ) : null}
                </ToolbarBody>
                <ToolbarButtonGroups>
                    <ToolbarButton title="Open in application" href={revision.urls.app}>
                        <Icon icon="arrow-up-right-from-square" className="size-4" />
                    </ToolbarButton>
                    {revision.git?.url ? (
                        <ToolbarButton title="Open git commit" href={revision.git.url}>
                            <Icon
                                icon={revision.git.url.includes('github.com') ? 'github' : 'gitlab'}
                                className="size-4"
                            />
                        </ToolbarButton>
                    ) : null}
                </ToolbarButtonGroups>
            </Toolbar>
        </ToolbarLayout>
    );
}
