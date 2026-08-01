import { PageHeader } from "./Common"

export const DropPaiwan = () => {
  return (
    <section>
      <PageHeader
        badge="Dropping Cards for Someone?"
        title=""
        description=""
      />

      <div className="flex w-full flex-wrap gap-2">
        <button className="btn btn-primary"> Primary <span className="icon-[tabler--star] size-4.5 shrink-0"></span></button>
      </div>
    </section>
  )
}