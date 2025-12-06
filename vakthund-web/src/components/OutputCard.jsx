import React from "react";
import { Card } from "@mui/joy";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-bash';

function OutputCard({ output, sx = {} }) {
    return (
        <Card
            variant="solid"
            color="neutral"
            sx={{
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                backgroundColor: 'neutral.600',
                ...sx
            }}
        >
            <Editor
                value={output || ''}
                onValueChange={() => {}}
                highlight={code => highlight(code, languages.bash, 'bash')}
                padding={10}
                style={{
                    pointerEvents: "none",
                    fontFamily: "monospace",
                    fontSize: "small",
                    color: 'lightgray',
                    overflow: 'unset'
                }}
            />
        </Card>
    );
}

export default OutputCard;
