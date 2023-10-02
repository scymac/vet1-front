import { ReactElement } from 'react'
import Logo from 'assets/logo/vonroll_logo.png'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Measurement, Order, Setup } from 'api/Interfaces'
import { avg, roundUp } from 'assets/functions/Calculations'
import themeColors from 'assets/theme/colors'
import { timestampFormat } from 'assets/functions/Conversions'
import PdfDocument1 from './PdfDocument1'

type Props = {
  variant    : 'document'|'snapshot',
  responsible: string,
  measList   : Measurement[],
  order      : Order,
  setup      : Setup
}

function Report1(props:Props) {

  const getDate = () => {
    const dates = props.measList.sort((a, b) => a.sample_no - b.sample_no).map((m) => m.tstamp)
    if (dates.length > 0) return timestampFormat(dates[0].toString())
    return '-'
  }

  const toSq = (res:number, width:number, gap:number) => ((res / 1000) * (width / gap)) // kOhm sq.

  const getAvg = (m: Measurement) => {
    if (props.setup.is_half_plate) {
      return avg([
        toSq(Number(m.l_res1.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
        toSq(Number(m.l_res2.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
        toSq(Number(m.l_res5.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
        toSq(Number(m.l_res6.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
        toSq(Number(m.l_res9.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
        toSq(Number(m.l_res10.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
      ]).toFixed(2)
    }
    return avg([
      toSq(Number(m.l_res1.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
      toSq(Number(m.l_res2.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
      toSq(Number(m.l_res3.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
      toSq(Number(m.l_res4.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
      toSq(Number(m.l_res5.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
      toSq(Number(m.l_res6.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
      toSq(Number(m.l_res7.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
      toSq(Number(m.l_res8.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
      toSq(Number(m.l_res9.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
      toSq(Number(m.l_res10.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
      toSq(Number(m.l_res11.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
      toSq(Number(m.l_res12.resistance), m.constants.sample_width, m.constants.spot_electrode_gap),
    ]).toFixed(2)
  }

  //* PDF document

  const pdfDocument = (
    <PdfDocument1
      responsible       = {props.responsible}
      material          = {props.setup.material}
      product           = {props.order.product_no}
      testDate          = {getDate()}
      targetThickness   = {Number(props.setup.target_thickness).toFixed(3)}
      measuredThickness = {Number(props.order.thickness).toFixed(3)}
      maxThickness      = {Number(props.setup.max_thickness).toFixed(2)}
      minThickness      = {Number(props.setup.min_thickness).toFixed(2)}
      lot               = {props.order.order_no}
      isHalfPlate       = {props.setup.is_half_plate}
      surfResMin        = {(Number(props.setup.min_lres) / 1000).toFixed(2)}
      surfResMax        = {(Number(props.setup.max_lres) / 1000).toFixed(2)}
      tResMin           = {(Number(props.setup.min_tres) / 1000).toFixed(4)}
      tResMax           = {(Number(props.setup.max_tres) / 1000).toFixed(4)}
      results           = {
        props.measList.sort((a, b) => a.sample_no - b.sample_no).map((m) => ({
          sampleNo:   m.sample_no.toFixed(0),
          surfaceRes: [
            toSq(Number(m.l_res1.resistance), m.constants.sample_width, m.constants.spot_electrode_gap).toFixed(2),
            toSq(Number(m.l_res2.resistance), m.constants.sample_width, m.constants.spot_electrode_gap).toFixed(2),
            toSq(Number(m.l_res3.resistance), m.constants.sample_width, m.constants.spot_electrode_gap).toFixed(2),
            toSq(Number(m.l_res4.resistance), m.constants.sample_width, m.constants.spot_electrode_gap).toFixed(2),
            toSq(Number(m.l_res5.resistance), m.constants.sample_width, m.constants.spot_electrode_gap).toFixed(2),
            toSq(Number(m.l_res6.resistance), m.constants.sample_width, m.constants.spot_electrode_gap).toFixed(2),
            toSq(Number(m.l_res7.resistance), m.constants.sample_width, m.constants.spot_electrode_gap).toFixed(2),
            toSq(Number(m.l_res8.resistance), m.constants.sample_width, m.constants.spot_electrode_gap).toFixed(2),
            toSq(Number(m.l_res9.resistance), m.constants.sample_width, m.constants.spot_electrode_gap).toFixed(2),
            toSq(Number(m.l_res10.resistance), m.constants.sample_width, m.constants.spot_electrode_gap).toFixed(2),
            toSq(Number(m.l_res11.resistance), m.constants.sample_width, m.constants.spot_electrode_gap).toFixed(2),
            toSq(Number(m.l_res12.resistance), m.constants.sample_width, m.constants.spot_electrode_gap).toFixed(2),
          ],
          surfaceResAvg: getAvg(m),
          tRes:          (Number(m.t_res.resistance) / 1000).toFixed(3),
          thickness:     Number(m.thickness).toFixed(3),
        }))
      }
    />
  )

  //* SNAPSHOT
  const validateValue = (validation: 'thickness'|'t_res'|'l_res'|'avg', value: number|null, hide?:boolean) => {
    switch (validation) {
      case 'thickness': return (
        <td
          style = {{
            padding:      '1mm',
            borderBottom: '1px solid #eee',
            color:        Number(value) > Number(props.setup.max_thickness) || Number(value) < Number(props.setup.min_thickness) ? themeColors.error.main : undefined,
            fontWeight:   Number(value) > Number(props.setup.max_thickness) || Number(value) < Number(props.setup.min_thickness) ? 800 : undefined,
          }}
        >
          {Number(value).toFixed(2)}
        </td>
      )
      case 't_res': return (
        <td
          style = {{
            width:        '15%',
            padding:      '1mm',
            borderRight:  '1px solid #aaa',
            borderBottom: '1px solid #eee',
            color:        Number(value) > Number(props.setup.max_tres) || Number(value) < Number(props.setup.min_tres) ? themeColors.error.main : undefined,
            fontWeight:   Number(value) > Number(props.setup.max_tres) || Number(value) < Number(props.setup.min_tres) ? 800 : undefined,
          }}
        >
          {value === null ? value : (Number(value) / 1000).toFixed(3)}
        </td>
      )
      case 'avg': return (
        <td
          style = {{
            width: '20%',

          }}
          rowSpan = {3}
        >
          Mtlw.
          {' '}
          <span
            style = {{
              color:      Number(value) > Number(props.setup.max_lres) / 1000 || Number(value) < Number(props.setup.min_lres) / 1000 ? themeColors.error.main : undefined,
              fontWeight: Number(value) > Number(props.setup.max_lres) / 1000 || Number(value) < Number(props.setup.min_lres) / 1000 ? 800 : undefined,
            }}
          >
            {Number(value).toFixed(2)}
          </span>
        </td>
      )
      case 'l_res': return (
        <td style = {{
          width:      '20%',
          color:      (Number(value) > Number(props.setup.max_lres) / 1000 || Number(value) < Number(props.setup.min_lres) / 1000) && !hide ? themeColors.error.main : undefined,
          fontWeight: (Number(value) > Number(props.setup.max_lres) / 1000 || Number(value) < Number(props.setup.min_lres) / 1000) && !hide ? 800 : undefined,
        }}
        >
          {hide ? '-' : Number(value).toFixed(2)}
        </td>
      )
    }
  }

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
            width: '50%',
          }}
        >
          <tbody>
            <tr>
              <td style = {{ width: '50%' }}>Material</td>
              <td style = {{ width: '50%', fontWeight: 600 }}>{props.setup.material}</td>
            </tr>
            <tr>
              <td style = {{ width: '50%' }}>Artikelnummer</td>
              <td style = {{ width: '50%', fontWeight: 600 }}>{props.order.product_no}</td>
            </tr>
            <tr>
              <td style = {{ width: '50%' }}>SOLL-Plattendicke [mm]</td>
              <td style = {{ width: '50%', fontWeight: 600 }}>
                { Number(props.setup.target_thickness).toFixed(3)}
              </td>
            </tr>
            <tr>
              <td style = {{ width: '50%' }}>IST-Plattendicke [mm]</td>
              <td style = {{ width: '50%', fontWeight: 600 }}>
                { Number(props.order.thickness).toFixed(3)}
              </td>
            </tr>
            <tr>
              <td style = {{ width: '50%' }}>Charge</td>
              <td style = {{ width: '50%', fontWeight: 600 }}>{props.order.order_no}</td>
            </tr>
          </tbody>
        </table>

        <table style = {{ width: '50%' }}>
          <tbody>
            <tr>
              <td style = {{ width: '60%' }}>{' '}</td>
              <td style = {{ width: '20%' }}>Min.</td>
              <td style = {{ width: '20%' }}>Max.</td>
            </tr>
            <tr>
              <td style = {{ width: '60%' }}>Plattendicke [mm]</td>
              <td style = {{ width: '20%' }}>{Number(props.setup.min_thickness).toFixed(2)}</td>
              <td style = {{ width: '20%' }}>{Number(props.setup.max_thickness).toFixed(2)}</td>
            </tr>
            <tr>
              <td style = {{ width: '60%' }}>Oberflächenwiderstand [kΩ sq.]</td>
              <td style = {{ width: '20%' }}>{(Number(props.setup.min_lres) / 1000).toFixed(2)}</td>
              <td style = {{ width: '20%' }}>{(Number(props.setup.max_lres) / 1000).toFixed(2)}</td>
            </tr>
            <tr>
              <td style = {{ width: '60%' }}>Durchgangswiderstand [kΩ] </td>
              <td style = {{ width: '20%' }}>{(Number(props.setup.min_tres) / 1000).toFixed(4)}</td>
              <td style = {{ width: '20%' }}>{(Number(props.setup.max_tres) / 1000).toFixed(4)}</td>
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
          width: '60%', padding: '1mm',  borderRight: '1px solid #aaa', borderBottom: '1px solid #ddd',
        }}
        >
          Oberflächenwiderstand [kΩ sq.]
        </td>
        <td style = {{
          width: '15%', padding: '1mm',  borderRight: '1px solid #aaa', borderBottom: '1px solid #ddd',
        }}
        >
          Durchgangswiderstand [kΩ]
        </td>
        {/* <td style = {{ width: '15%', padding: '1mm', borderBottom: '1px solid #ddd' }}>Plattendicke [mm]</td> */}
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
                width: '60%', padding: '1mm',  borderRight: '1px solid #aaa', borderBottom: '1px solid #eee',
              }}
              >
                <table style = {{ width: '100%' }}>
                  <tbody>
                    <tr>
                      {validateValue('l_res', toSq(Number(m.l_res1.resistance), m.constants.sample_width, m.constants.spot_electrode_gap))}
                      {validateValue('l_res', toSq(Number(m.l_res2.resistance), m.constants.sample_width, m.constants.spot_electrode_gap))}
                      {validateValue('l_res', toSq(Number(m.l_res3.resistance), m.constants.sample_width, m.constants.spot_electrode_gap), props.setup.is_half_plate)}
                      {validateValue('l_res', toSq(Number(m.l_res4.resistance), m.constants.sample_width, m.constants.spot_electrode_gap), props.setup.is_half_plate)}
                      {validateValue('avg', Number(getAvg(m)))}
                    </tr>
                    <tr>
                      {validateValue('l_res', toSq(Number(m.l_res5.resistance), m.constants.sample_width, m.constants.spot_electrode_gap))}
                      {validateValue('l_res', toSq(Number(m.l_res6.resistance), m.constants.sample_width, m.constants.spot_electrode_gap))}
                      {validateValue('l_res', toSq(Number(m.l_res7.resistance), m.constants.sample_width, m.constants.spot_electrode_gap), props.setup.is_half_plate)}
                      {validateValue('l_res', toSq(Number(m.l_res8.resistance), m.constants.sample_width, m.constants.spot_electrode_gap), props.setup.is_half_plate)}
                    </tr>
                    <tr>
                      {validateValue('l_res', toSq(Number(m.l_res9.resistance), m.constants.sample_width, m.constants.spot_electrode_gap))}
                      {validateValue('l_res', toSq(Number(m.l_res10.resistance), m.constants.sample_width, m.constants.spot_electrode_gap))}
                      {validateValue('l_res', toSq(Number(m.l_res11.resistance), m.constants.sample_width, m.constants.spot_electrode_gap), props.setup.is_half_plate)}
                      {validateValue('l_res', toSq(Number(m.l_res12.resistance), m.constants.sample_width, m.constants.spot_electrode_gap), props.setup.is_half_plate)}
                    </tr>
                  </tbody>
                </table>
              </td>
              {validateValue('t_res', m.t_res.resistance)}
              {/* validateValue('thickness', m.thickness) */}

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
    const firstSample = 10 // page 1 last serial ndx
    const nrPerPage = 12
    const pageNr = ((len - firstSample) / nrPerPage) % 1 === 0 ? ((len - firstSample) / nrPerPage) : roundUp((len - firstSample) / nrPerPage, 0)
    const pageArray:ReactElement[] = []
    for (let i = 0; i < pageNr; i += 1) {
      pageArray.push(results(firstSample + (i * nrPerPage) + 1, firstSample + (i * nrPerPage) + nrPerPage))
    }
    return pageArray.map((resultsPart, ii) => (
      reportPage(
        <div key = {ii}>
          {header}
          {resultsPart}
          {ii + 1 === pageNr ? footer : null}
        </div>,
      )
    ))
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
      <Box style = {{ width: '30%' }}>
        <Typography>
          Messdatum:
          {' '}
          {getDate()}
        </Typography>
      </Box>
      <Box style = {{ width: '45%' }}>
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
            {results(1, 10)}
            {props.measList.length <= 10 ? footer : null}
          </>,
        )
      }
      {props.measList.length > 10 ? getExtraPages() : null}

    </>
  )

  return props.variant === 'document' ? pdfDocument : pdfSnap
}

export default Report1
