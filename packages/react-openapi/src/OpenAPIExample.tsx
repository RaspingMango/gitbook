import type { OpenAPIV3 } from '@gitbook/openapi-parser';
import type { OpenAPIContext, OpenAPIUniversalContext } from './context';
import { json2xml } from './json2xml';
import { stringifyOpenAPI } from './stringifyOpenAPI';
import { t } from './translate';

/**
 * Display an example.
 */
export function OpenAPIExample(props: {
    example: OpenAPIV3.ExampleObject;
    context: OpenAPIContext;
    syntax: string;
}) {
    const { example, context, syntax } = props;
    const code = stringifyExample({ example, xml: syntax === 'xml' });

    if (code === null) {
        return <OpenAPIEmptyExample context={context} />;
    }

    return context.renderCodeBlock({ code, syntax });
}

function stringifyExample(args: { example: OpenAPIV3.ExampleObject; xml: boolean }): string | null {
    const { example, xml } = args;

    if (!example.value) {
        return null;
    }

    if (typeof example.value === 'string') {
        return example.value;
    }

    if (xml) {
        return json2xml(example.value);
    }

    return stringifyOpenAPI(example.value, null, 2);
}

/**
 * Empty response example.
 */
export function OpenAPIEmptyExample(props: {
    context: OpenAPIUniversalContext;
}) {
    const { context } = props;
    return (
        <pre className="openapi-example-empty">
            <p>{t(context.translation, 'no_content')}</p>
        </pre>
    );
}
