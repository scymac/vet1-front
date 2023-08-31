import { ReactElement } from 'react'
import Logo from 'assets/logo/vonroll_logo.png'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Measurement, Order, Setup } from 'api/Interfaces'
import { avg, roundDown, roundUp } from 'assets/functions/Calculations'
import PdfDocument2 from './PdfDocument2'

const resultsPerPage = 22

type Props = {
  variant    : 'document'|'snapshot',
  responsible: string,
  measList   : Measurement[],
  order      : Order,
  setup      : Setup
}

function Report2(props:Props) {

  const getAvg = (m: Measurement) => (
    avg([
      (Number(m.l_res1.resistance) / 1000),
      (Number(m.l_res2.resistance) / 1000),
      (Number(m.l_res3.resistance) / 1000),
      (Number(m.l_res4.resistance) / 1000),
      (Number(m.l_res5.resistance) / 1000),
      (Number(m.l_res6.resistance) / 1000),
      (Number(m.l_res7.resistance) / 1000),
      (Number(m.l_res8.resistance) / 1000),
      (Number(m.l_res9.resistance) / 1000),
      (Number(m.l_res10.resistance) / 1000),
      (Number(m.l_res11.resistance) / 1000),
      (Number(m.l_res12.resistance) / 1000),
    ]).toFixed(3)
  )

  //* PDF document

  const pdfDocument = (
    <PdfDocument2
      responsible       = {props.responsible}
      material          = {props.setup.material}
      product           = {props.order.product_no}
      thickness         = {Number(props.setup.target_thickness).toFixed(2)}
      maxThickness      = {Number(props.setup.max_thickness).toFixed(2)}
      minThickness      = {Number(props.setup.min_thickness).toFixed(2)}
      electrodeDistance = {Number(props.setup.electrode_distance).toFixed(2)}
      sampleWidth       = {Number(props.setup.sample_width).toFixed(2)}
      lot               = {props.order.order_no}
      wResMin           = {(Number(props.setup.min_wres) / 1000).toFixed(4)}
      wResMax           = {(Number(props.setup.max_wres) / 1000).toFixed(4)}
      results           = {
        props.measList.sort((a, b) => a.sample_no - b.sample_no).map((m) => ({
          sampleNo: m.sample_no.toFixed(0),
          wRes:     {
            resistance: (Number(m.t_res.resistance) / 1000).toFixed(3),
            current:    (Number(m.t_res.current) * 1000).toFixed(3),
            voltage:    Number(m.t_res.resistance).toFixed(3),
          },
          thickness: Number(m.thickness).toFixed(3),
        }))
      }
    />
  )

  //* SNAPSHOT
  const header = (
    <Box
      style = {{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
      }}
    >
      <div>
        <Typography
          style = {{
            fontSize: 22,
          }}
        >
          Widerstandsmessung
        </Typography>
        <Typography
          style = {{
            fontSize:  18,
            marginTop: '10px',
          }}
        >
          Messbericht
        </Typography>
      </div>
      <img
        src = {Logo}
        alt = "logo"
        width = {180}
      />
    </Box>
  )
  const info = (
    <Box
      style = {{
        marginTop: '10mm',
        border:    '1px solid #aaa',
      }}
    >
      <Box
        style = {{
          padding: '2mm',
          display: 'flex',
        }}
      >

        <table
          style = {{
            width: '45%',
          }}
        >
          <tbody>
            <tr>
              <td style = {{ width: '40%' }}>Material</td>
              <td style = {{ width: '60%', fontWeight: 600 }}>{props.setup.material}</td>
            </tr>
            <tr>
              <td style = {{ width: '40%' }}>Artikelnummer</td>
              <td style = {{ width: '60%', fontWeight: 600 }}>{props.order.product_no}</td>
            </tr>
            <tr>
              <td style = {{ width: '40%' }}>Plattendicke</td>
              <td style = {{ width: '60%', fontWeight: 600 }}>
                { ((Number(props.setup.max_thickness) + Number(props.setup.min_thickness)) / 2).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style = {{ width: '60%' }}>Elektrodenabstand [mm] </td>
              <td style = {{ width: '40%', fontWeight: 600  }}>{Number(props.setup.electrode_distance).toFixed(0)}</td>
            </tr>
            <tr>
              <td style = {{ width: '60%' }}>Plattenbreite [mm] </td>
              <td style = {{ width: '40%', fontWeight: 600  }}>{Number(props.setup.sample_width).toFixed(0)}</td>
            </tr>
            <tr>
              <td style = {{ width: '40%' }}>Charge</td>
              <td style = {{ width: '60%', fontWeight: 600 }}>{props.order.order_no}</td>
            </tr>
          </tbody>
        </table>

        <table style = {{ width: '55%' }}>
          <tbody>
            <tr>
              <td style = {{ width: '70%' }}>{' '}</td>
              <td style = {{ width: '15%' }}>Min.</td>
              <td style = {{ width: '15%' }}>Max.</td>
            </tr>
            <tr>
              <td style = {{ width: '60%' }}>Plattendicke [mm]</td>
              <td style = {{ width: '20%' }}>{Number(props.setup.min_thickness).toFixed(2)}</td>
              <td style = {{ width: '20%' }}>{Number(props.setup.max_thickness).toFixed(2)}</td>
            </tr>
            <tr>
              <td style = {{ width: '60%' }}>Oberflächenwiderstand [kΩ sq.]</td>
              <td style = {{ width: '20%' }}>{(Number(props.setup.min_wres) / 1000).toFixed(4)}</td>
              <td style = {{ width: '20%' }}>{(Number(props.setup.max_wres) / 1000).toFixed(4)}</td>
            </tr>

          </tbody>
        </table>

      </Box>
    </Box>
  )

  const tableHeader = (
    <thead>
      <tr style = {{
        textAlign: 'center', fontSize: 14, background: '#f5f5f5',
      }}
      >
        <td style = {{
          width: '10%', padding: '1mm',  borderRight: '1px solid #aaa', borderBottom: '1px solid #ddd',
        }}
        >
          Platten Nummer
        </td>
        <td style = {{
          width: '20%', padding: '1mm',  borderRight: '1px solid #aaa', borderBottom: '1px solid #ddd',
        }}
        >
          Strom [mA]
        </td>
        <td style = {{
          width: '20%', padding: '1mm',  borderRight: '1px solid #aaa', borderBottom: '1px solid #ddd',
        }}
        >
          Spannung [V]
        </td>
        <td style = {{
          width: '30%', padding: '1mm',  borderRight: '1px solid #aaa', borderBottom: '1px solid #ddd',
        }}
        >
          Oberflächenwiderstand [kΩ sq.]
        </td>
        <td style = {{ padding: '1mm', borderBottom: '1px solid #ddd' }}>Dicke [mm]</td>
      </tr>
    </thead>
  )

  const tableBody = (from: number, to: number) => (
    <tbody>
      {props.measList.sort((a, b) => a.sample_no - b.sample_no).map((m, i) => (
        i >= from - 1 && i <= to - 1
          ? (
            <tr key = {i} style = {{ textAlign: 'center', fontSize: 14 }}>
              <td style = {{
                width: '10%', padding: '1mm',  borderRight: '1px solid #aaa', borderBottom: '1px solid #eee',
              }}
              >
                {m.sample_no}
              </td>
              <td style = {{
                width: '20%', padding: '1mm',  borderRight: '1px solid #aaa', borderBottom: '1px solid #eee',
              }}
              >
                {m.t_res.current === null ? m.t_res.current : (Number(m.t_res.current) * 1000).toFixed(3)}
              </td>
              <td style = {{
                width: '20%', padding: '1mm',  borderRight: '1px solid #aaa', borderBottom: '1px solid #eee',
              }}
              >
                {m.t_res.voltage === null ? m.t_res.voltage : Number(m.t_res.voltage).toFixed(3)}
              </td>
              <td style = {{
                width: '20%', padding: '1mm',  borderRight: '1px solid #aaa', borderBottom: '1px solid #eee',
              }}
              >
                {m.t_res.resistance === null ? m.t_res.resistance : (Number(m.t_res.resistance) / 1000).toFixed(3)}
              </td>
              <td style = {{ padding: '1mm', borderBottom: '1px solid #eee' }}>{Number(m.thickness).toFixed(2)}</td>
            </tr>
          )
          : null
      ))}
    </tbody>
  )
  const results = (from:number, to:number) => (
    <Box
      style = {{
        marginTop: '5mm',
        border:    '1px solid #aaa',
      }}
    >
      <table
        cellSpacing = "0"
        cellPadding = "0"
      >
        {tableHeader}
        {tableBody(from, to)}
      </table>
    </Box>
  )

  const reportPage = (content:ReactElement) => (
    <Box
      style = {{
        border:        '1px solid #666',
        marginTop:     '1rem',
        marginBottom:  '1rem',
        paddingBottom: '30mm',
        paddingTop:    '30mm',
        paddingLeft:   '20mm',
        paddingRight:  '20mm',
        width:         '210mm',
        height:        '297mm',
      }}
    >
      {content}
    </Box>
  )

  const getExtraPages = () => {
    const len = props.measList.length
    const firstSample = resultsPerPage // page 1 last serial ndx
    const nrPerPage = 30
    const pageNr = roundUp(len / nrPerPage, 0)
    const pageArray:ReactElement[] = []
    for (let i = 0; i < pageNr; i += 1) {
      pageArray.push(results(firstSample + (i * nrPerPage) + 1, firstSample + (i * nrPerPage) + nrPerPage))
    }
    return pageArray.map((resultsPart, ii) => (
      reportPage(
        <div key = {ii}>
          {header}
          {resultsPart}
          {ii === pageNr - 1 ? footer : null}
        </div>,
      )
    ))
  }

  const today = () => {
    const now = new Date()
    return `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`
  }

  const footer = (
    <Box
      style = {{
        marginTop: '5mm',
        border:    '1px solid #aaa',
        display:   'flex',
        width:     '203.3mm',
        padding:   '2mm 3mm 2mm 3mm',
      }}
    >
      <Box style = {{ width: '25%' }}>
        <Typography>
          Datum:
          {' '}
          {today()}
        </Typography>
      </Box>
      <Box style = {{ width: '50%' }}>
        <Typography>
          Kontrolleur:
          {' '}
          {props.responsible}
        </Typography>
      </Box>
      <Box style = {{ width: '25%' }}>
        <Typography>Visum:</Typography>
      </Box>
    </Box>
  )

  const pdfSnap = (

    <>
      {
        reportPage(
          <>
            {header}
            {info}
            {results(1, resultsPerPage)}
            {props.measList.length <= resultsPerPage ? footer : null}
          </>,
        )
      }
      {props.measList.length > resultsPerPage ? getExtraPages() : null}

    </>
  )

  return props.variant === 'document' ? pdfDocument : pdfSnap
}

export default Report2