export default function PanelFrame({ index, code, title, tone = 'neutral', headerRight = null, children }) {
  return (
    <section className={`panel-frame${tone !== 'neutral' ? ` tone-${tone}` : ''}`}>
      <div className="panel-head">
        {index ? <span className="panel-index">{index}</span> : null}
        <h3 className="panel-title">{title}</h3>
        {headerRight ? <div className="panel-head-right">{headerRight}</div> : null}
        {code ? <span className="panel-code">{code}</span> : null}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}
