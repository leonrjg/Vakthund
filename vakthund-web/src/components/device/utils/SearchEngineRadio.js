import FormLabel from "@mui/joy/FormLabel";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import Radio from "@mui/joy/Radio";
import Avatar from "@mui/joy/Avatar";
import Typography from "@mui/joy/Typography";
import React from "react";

export function GetSearchEngineRadio(onChangeRadioCallback, defaultEngine) {
    return (
        <>
            <FormLabel>Select a search engine for this query</FormLabel>
            <RadioGroup overlay name="engine" defaultValue={defaultEngine} orientation="horizontal" sx={{gap: 2}}>
                {["Shodan", "ZoomEye"].map((engine) => (
                    <Sheet component="label" key={engine} variant="outlined"
                        sx={{p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'sm', borderRadius: 'md',}}>
                        <Radio
                            value={`${engine}`}
                            checked={defaultEngine === engine}
                            onChange={ onChangeRadioCallback }
                            variant="soft"
                            sx={{
                                mb: 2,
                            }}
                        />
                        <Avatar alt={`${engine}`} />
                        <Typography level="body-sm" sx={{mt: 1}}>{engine}</Typography>
                    </Sheet>
                ))}
            </RadioGroup>
        </>
    );
}