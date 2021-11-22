/*
 * PlotVariableMenu.tsx
 * Copyright: Microsoft 2019
 *
 * A context menu for mapping variables.
 */

import React from 'react';

import { IContextualMenuProps } from '@fluentui/react/lib/ContextualMenu';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { PlotModel } from './PlotModel';

interface PlotVariableMenuProps {
    label: string;
    axisKey?: string;
    model: PlotModel;
    clickHandler: (axisKey?: string) => void;
}

export const NoneLabel = 'none';

// A basic popup menu button
export const PlotVariableMenu: React.FunctionComponent<PlotVariableMenuProps> = ({
    label,
    axisKey,
    model,
    clickHandler,
}) => {
    const menuProps: IContextualMenuProps = {
        shouldFocusOnMount: true,
        items: [
            ...Object.keys(model.state).map(item => {
                return {
                    key: item,
                    text: item,
                    onClick: () => {
                        clickHandler(item);
                    },
                    checked: item === axisKey,
                };
            }),
            {
                key: 'undefined',
                text: NoneLabel,
                onClick: () => {
                    clickHandler(undefined);
                },
                canCheck: true,
                checked: undefined === axisKey,
            },
        ],
    };

    return (
        <DefaultButton text={label + ' ' + (axisKey ?? NoneLabel)} menuProps={menuProps} style={{ marginRight: 4 }} />
    );
};
