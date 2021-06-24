import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Typography from "@material-ui/core/Typography";
import React, {useCallback, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Table, Theme} from "@material-ui/core";
import {createStyles} from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import {StandardPaginationActions} from "../components/StandardPaginationActions";

export type StandardTableRows<T extends Readonly<Headers>> =
    Array<Record<string, string | React.ReactNode>> &
    Array<{
        [k in T[number]["id"]]: string | React.ReactNode;
    }>

type CellStyles = {
    width?: number,
}

type Headers = Array<{
    id: string,
    label: string,
    width?: number,
}>

export interface StandardTableProps<T extends Readonly<Headers>> {
    headers: T;
    rows: StandardTableRows<T>;
}

const useTableStyles = makeStyles((theme) =>
    createStyles({
        tableHead: {
            backgroundColor: theme.palette.background.default,
        },
        tableContainer: {
        },
        logo: {
            height: '30px',
            width: '30px',
            objectFit: 'contain',
        },
    })
)

const renderRowItem = (rowItem: string | React.ReactNode | undefined) => {
    if (typeof rowItem === 'undefined') {
        return <></>
    } else if (typeof rowItem === 'string') {
        return <Typography variant="body1">{rowItem}</Typography>;
    }
    return <Grid container justify="space-evenly">{rowItem}</Grid>
}

const cellStyles = ({ width }: CellStyles): React.CSSProperties => ({
    maxWidth: width || '50px',
    padding: 15,
    overflow: 'hidden',
    textAlign: 'center',
});
export const StandardTable = <T extends Readonly<Headers>>({headers, rows }: StandardTableProps<T>) => {
    const classes = useTableStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);

    const handleChangePage = useCallback((event: unknown, newPage: number) => {
        setPage(newPage);
    },[]);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    return (
        <TableContainer className={classes.tableContainer} component={Paper}>
            <Table stickyHeader>
                <TableHead className={classes.tableHead}>
                    <TableRow>
                        {headers.map((header) => (
                                <TableCell
                                    style={cellStyles({width: header.width})}
                                    key={header.label}
                                >
                                    {header.label}
                                </TableCell>
                            )
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                    ).map((row, index) => {
                        return (<TableRow key={index.toString()}>
                            {(headers).map((header, index) => (
                                <TableCell
                                    style={cellStyles({width: header.width})}
                                    key={header.label || index.toString()}
                                >
                                    {renderRowItem(row[header.id])}
                                </TableCell>
                            ))}
                        </TableRow>)
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[15, 25, 50, { label: 'All', value: -1 }]}
                            colSpan={6}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                    'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={StandardPaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
};