// React
import { useMemo, useState } from 'react'

// Mui
import { makeStyles } from '@mui/styles'

// Custom
import { AlarmList } from 'api/AlarmList'
import { timestampFormat2 } from 'assets/functions/Conversions'

// Types
import { ScreenDim } from 'types/types'

// Styles
import componentStyles from './AlarmTable-CSS'
import './AlarmTable.css'

const useStyles: any = makeStyles(componentStyles)

type Props = {
  screenDim: ScreenDim
  headers: string[][]
  data: string[][]
  tab: 'current' | 'history'
}

export default function MeasTable(props: Props) {
  const classes = useStyles()

  const [tableData, setTableData] = useState<string[][]>([])

  //* sorting
  const [sortingCol, setSortingCol] = useState(0) // sort by sample_no by default
  const [sortDirection, setSortDirection] = useState(false) // sort descending by default

  const sortCol = (
    sortData: string[][],
    col: number,
    updateSorting: boolean
  ) => {
    setSortingCol(col)
    let sortDir = sortDirection
    console.log(col)

    // set direction
    if (updateSorting) {
      setSortDirection(!sortDirection)
      sortDir = !sortDirection
    }

    // do the sorting
    if (col === 2) {
      // consider cells as date
      if (sortDir) {
        setTableData(
          sortData.sort((a, b) => Date.parse(a[col]) - Date.parse(b[col]))
        )
      } else {
        setTableData(
          sortData.sort((a, b) => Date.parse(b[col]) - Date.parse(a[col]))
        )
      }
    } else if (sortDir) {
      // consider cells as numbers
      setTableData(
        sortData.sort((a, b) =>
          a[col].localeCompare(b[col], undefined, { numeric: true })
        )
      )
    } else {
      setTableData(
        sortData.sort((a, b) =>
          b[col].localeCompare(a[col], undefined, { numeric: true })
        )
      )
    }
  }

  useMemo(() => {
    if (sortingCol > -1) {
      sortCol(props.data, sortingCol, false)
    } else setTableData(props.data)
  }, [props.data, sortDirection])

  const getCellContent = (r: number, c: number, d: string[][]) => {
    if (c === 2) return timestampFormat2(d[r][c])
    if (c === 3)
      return AlarmList.filter(a => a.code === d[r][1]).length > 0
        ? AlarmList.filter(a => a.code === d[r][1])[0].name
        : null
    if (c === 4)
      return AlarmList.filter(a => a.code === d[r][1]).length > 0
        ? AlarmList.filter(a => a.code === d[r][1])[0].target
        : null
    if (c === 5)
      return AlarmList.filter(a => a.code === d[r][1]).length > 0
        ? AlarmList.filter(a => a.code === d[r][1])[0].description
        : null
    if (c === 6)
      return AlarmList.filter(a => a.code === d[r][1]).length > 0
        ? AlarmList.filter(a => a.code === d[r][1])[0].causes
        : null
    return d[r][c]
  }

  const getCell = (r: number, c: number) => {
    const d = tableData
    if (d.length > 0) {
      return (
        <td key={`dc${c}`} hidden={getHiddenCol(c)}>
          {getCellContent(r, c, d)}
        </td>
      )
    }
  }

  const getBody = () => (
    <>
      {tableData.map((r, ii) => (
        <tr
          key={`dr${ii}`}
          className={
            props.tab === 'current' ? classes.current : classes.history
          }
          hidden={tableData[ii][1] === '1.00'}
        >
          {r.map((c, jj) => getCell(ii, jj))}
          {getCell(ii, 3)}
          {getCell(ii, 4)}
          {getCell(ii, 5)}
          {getCell(ii, 6)}
        </tr>
      ))}
    </>
  )

  const getColWidth = (r: number, c: number) => {
    if (c === 0) return 120
    if (c === 1) return 60
    if (c === 2) return 140
    if (c === 3) return 200
    if (c === 4) return 180
    if (c === 5) return 500
    if (c === 6) return 500
  }

  const getHiddenCol = (c: number) =>
    c === 0 || (props.tab === 'current' && c === 2)

  return (
    <div
      id="alarmTableDiv"
      style={{
        height: props.screenDim.height - 180
      }}
    >
      <table id="alarmTable">
        <thead
          style={{
            background: '#fff'
          }}
        >
          {props.headers.map((hr, i) => (
            <tr key={i}>
              {hr.map((hc, j) => (
                <th
                  key={j}
                  style={{
                    cursor: j === 1 || j === 2 ? 'pointer' : 'default',
                    maxWidth: getColWidth(i, j),
                    minWidth: getColWidth(i, j),
                    width: getColWidth(i, j)
                  }}
                  onClick={() => {
                    if (j === 1 || j === 2) sortCol(tableData, j, true)
                  }}
                  hidden={getHiddenCol(j)}
                >
                  {hc}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>{getBody()}</tbody>
      </table>
    </div>
  )
}
