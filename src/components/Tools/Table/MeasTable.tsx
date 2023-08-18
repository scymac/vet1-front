// React
import { useEffect, useState } from 'react'

// Mui
import Tooltip from '@mui/material/Tooltip'
import { makeStyles } from '@mui/styles'

// Custom
import { meanFromStrArray } from 'assets/functions/Calculations'

// Types
import { ScreenDim } from 'types/types'

// Styles
import componentStyles from './MeasTable-CSS'
import './MeasTable.css'

const useStyles:any = makeStyles(componentStyles)

type Props = {
  screenDim        : ScreenDim,
  headers          : string[][],
  data             : string[][],

  // scrollTopPosition: number,
  // colSpanFlag      : boolean      // true if showing local resistance but not whole resistance
}

export default function MeasTable(props:Props) {

  const classes = useStyles()

  const scrollLimit = 20

  const [tableData, setTableData] = useState(props.data)

  //* sorting
  const [sortingCol, setSortingCol]       = useState(0)     // sort by sample_no by default
  const [sortDirection, setSortDirection] = useState(false)  // sort descending by default

  const sortCol = (sortData:string[][], col:number, updateSorting:boolean) => {
    if (updateSorting) {
      setSortDirection(!sortDirection)
    }
    if (sortDirection) {
      setTableData(
        sortData.sort((a, b) => {
          if (a[col] < b[col]) return -1
          if (a[col] > b[col]) return 1
          return 0
        }),
      )
    }
    else {
      setTableData(
        sortData.sort((a, b) => {
          if (a[col] < b[col]) return 1
          if (a[col] > b[col]) return -1
          return 0
        }),
      )
    }
  }

  useEffect(() => {
    if (sortingCol > -1) {
      sortCol(props.data, sortingCol, sortDirection)
    }
    else setTableData(props.data)
    console.log(props.data)
  }, [props.data])

  /*
  const getHeaderTop = () => {
    if (props.scrollTopPosition > scrollLimit) return 50
    return 0
  }
  */

  const getCellContent = (r:number, c:number, d:string[][]) => {
    if (c === 1) {
      return (
        <Tooltip
          arrow
          title      = {<div style = {{ fontSize: 13 }}>{d[r][c] ? 'fertig' : 'offen'}</div>}
          placement  = "left-start"
          enterDelay = {300}
        >
          <div>
            {d[r][c] ? '✔' : '☐'}
          </div>
        </Tooltip>
      )
    }
    if (c === 6) {
      return (
        <div
          key = {`dc${c}`}
        >
          {
          d[r][6].length === 0 ? '-'
            :          (
              <div className = {classes.rTableDiv}>
                <table
                  className = {classes.rTable}
                  key = {`subtable${r}${c}`}
                >
                  <tbody>
                    <tr>
                      <td>
                        {d[r][6]}
                      </td>
                      <td>
                        {d[r][7]}
                      </td>
                      <td>
                        {d[r][8]}
                      </td>
                      <td>
                        {d[r][9]}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {d[r][10]}
                      </td>
                      <td>
                        {d[r][11]}
                      </td>
                      <td>
                        {d[r][12]}
                      </td>
                      <td>
                        {d[r][13]}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {d[r][14]}
                      </td>
                      <td>
                        {d[r][15]}
                      </td>
                      <td>
                        {d[r][16]}
                      </td>
                      <td>
                        {d[r][17]}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  Mtlw.
                  <br />
                  {meanFromStrArray(d[r].slice(6)).toFixed(2)}
                </div>
              </div>
            )
        }
        </div>
      )
    }
    if ([0, 2, 3, 4, 5].includes(c)) return d[r][c]
  }

  const getCell = (r:number, c:number) => {
    const d = props.data
    if (d.length > 0 && c <= 6) {
      return (
        <td
          key = {`dc${c}`}
        >
          {
            getCellContent(r, c, d)
          }
        </td>
      )
    }
  }

  const getColSpan = (r:number, c:number) => (r === 0 && c === 5 ? 2 : undefined)

  const getColWidth = (r:number, c:number) => {
    if (r === 0) {
      if (c === 0) return 80
      if (c === 1) return 45
      if (c === 2) return 140
      if (c === 3) return 50
      if (c === 4) return 170
      if (c === 5) return 80
      if (c >= 6) return 200
    }
    if (r === 1) {
      if (c === 0) return 80

      // if(c >= 1) return 45
    }
  }

  return (

    <div
      id = "measTableDiv"
      style = {{
        height: props.screenDim.height - 180,
      }}
    >
      <table
        id = "measTable"
      >
        <thead
          style = {{
            background: '#fff',

            // position  : props.scrollTopPosition < scrollLimit ? undefined : "fixed",
            // top       : getHeaderTop(),
          }}
        >
          {
            props.headers.map((hr, i) => (
              <tr
                key = {i}
              >
                {
                    hr.map((hc, j) => (
                      <th
                        rowSpan = {i === 0 && j < 5 ? 2 : undefined}
                        colSpan = {getColSpan(i, j)}
                        key     = {j}
                        style   = {{
                          cursor:   'pointer',
                          maxWidth: getColWidth(i, j),
                          minWidth: getColWidth(i, j),
                          width:    getColWidth(i, j),
                        }}
                        onClick = {j > 5 ? undefined : () => sortCol(tableData, j, true)}
                      >
                        {hc}
                      </th>
                    ))
                  }
              </tr>
            ))
          }
        </thead>

        <tbody>
          {
            props.data.map((r, ii) => (
              <tr
                key = {`dr${ii}`}
              >
                {
                  r.map((c, jj) => getCell(ii, jj))
                }
              </tr>
            ))
          }
        </tbody>
      </table>

    </div>

  )
}
