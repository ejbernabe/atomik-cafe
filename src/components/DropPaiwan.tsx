import { PageHeader } from "./Common"

export const DropPaiwan = () => {
  return (
    <section className="w-full px-4 sm:px-6 py-10 flex flex-col gap-6">
      <PageHeader
        badge="Dropping Cards for Someone?"
        title=""
        description=""
      />

      {/* Main 2-Column Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center min-h-[350px]">
        
        {/* Left Column: Stepper + Get Started Button */}
        <div className="flex flex-col justify-between h-full gap-6">
          {/* FlyonUI Stepper */}
          <ul className="stepper stepper-horizontal w-full">
            <li className="stepper-item active">
              <span className="stepper-circle">1</span>
              <span className="stepper-title">Register</span>
            </li>
            <li className="stepper-item">
              <span className="stepper-circle">2</span>
              <span className="stepper-title">Choose</span>
            </li>
            <li className="stepper-item">
              <span className="stepper-circle">3</span>
              <span className="stepper-title">Drop</span>
            </li>
          </ul>

          {/* Action Button */}
          <div>
            <button className="btn btn-primary gap-2">
              Get Started!
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <g fill="none">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.95 16.264s-1.703 2.54-.707 3.535c.995.996 3.535-.707 3.535-.707" />
                  <path fill="currentColor" fillRule="evenodd" d="M20.506 3.536a1 1 0 0 1 .268.928l-.317 1.402a9 9 0 0 1-2.414 4.375l-4.644 4.644c1.027 1.272 1.36 2.48 1.1 3.632c-.271 1.2-1.16 2.086-1.712 2.637l-.06.06a1 1 0 0 1-1.564-.193L9.17 17.696a1 1 0 0 0-.15-.192l-2.57-2.568l-.76-.456l3.459-3.843l.007.005L13.8 6a9 9 0 0 1 4.376-2.414l1.402-.318a1 1 0 0 1 .928.269zM8.322 10.062c-.969-.565-1.9-.722-2.797-.52c-1.2.272-2.086 1.16-2.637 1.713l-.06.059a1 1 0 0 0 .193 1.564l1.796 1.078z" clipRule="evenodd" />
                </g>
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: Skeleton Component */}
        <div className="w-full h-full min-h-[250px] flex justify-center items-center">
          <div className="skeleton w-full h-full min-h-[200px] rounded-xl"></div>
        </div>

      </div>
    </section>
  )
}