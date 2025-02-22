import FormLabel from "@mui/joy/FormLabel";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import Radio from "@mui/joy/Radio";
import Avatar from "@mui/joy/Avatar";
import Typography from "@mui/joy/Typography";
import * as React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getSettings} from "../../../redux/actions/Actions";
import {useEffectOnce} from "react-use";

export function GetSearchEngineRadio(onChangeRadioCallback, defaultEngine, settings) {
    let engines = Object.keys(settings?.engines);
    return (
        <>
            <FormLabel>Select a search engine for this query</FormLabel>
            <RadioGroup overlay name="engine" defaultValue={defaultEngine} orientation="horizontal" sx={{gap: 2}}>
                {engines.map((engine, i) => {
                    return <Sheet component="label" key={name} variant="outlined"
                           sx={{
                               p: 2,
                               display: 'flex',
                               flexDirection: 'column',
                               alignItems: 'center',
                               boxShadow: 'sm',
                               borderRadius: 'md',
                           }}>
                        <Radio
                            required
                            value={`${engine}`}
                            checked={defaultEngine === engine}
                            onChange={onChangeRadioCallback}
                            variant="soft"
                            sx={{
                                mb: 2,
                            }}
                        />
                        <Avatar alt={`${engine}`}>
                            <img alt={`${engine}`} src={settings.engines[engine].icon} style={{maxWidth: "32px"}} />
                        </Avatar>
                        <Typography level="body-sm" sx={{mt: 1}}>{engine}</Typography>
                    </Sheet>
                })}
            </RadioGroup>
        </>
    );
}