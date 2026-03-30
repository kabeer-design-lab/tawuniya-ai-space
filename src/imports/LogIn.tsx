import imgImg from "figma:asset/455d1356f9baed9a176feddf5ae4c24cab21915f.png";

function Img() {
  return (
    <div className="h-[60.443px] relative shrink-0 w-full" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg} />
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col h-[60.443px] items-start relative shrink-0 w-[209.823px]" data-name="button">
      <Img />
    </div>
  );
}

function TextAndSupportingText() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 text-center w-full" data-name="Text and supporting text">
      <p className="font-['DM_Sans:Semibold',sans-serif] leading-[38px] not-italic relative shrink-0 text-[#181d27] text-[30px] w-full">Log in to your account</p>
      <p className="font-['DM_Sans:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#535862] text-[16px] w-full" style={{ fontVariationSettings: "'opsz' 14" }}>
        Welcome back! Please enter your details.
      </p>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col gap-[64px] items-center relative shrink-0 w-full" data-name="Header">
      <Button />
      <TextAndSupportingText />
    </div>
  );
}

function Content2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Content">
      <p className="flex-[1_0_0] font-['DM_Sans:Regular',sans-serif] font-normal leading-[24px] min-h-px min-w-px overflow-hidden relative text-[#717680] text-[16px] text-ellipsis text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        Enter your email
      </p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full" data-name="Input">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-tl-[8px] rounded-tr-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[14px] py-[10px] relative w-full">
          <Content2 />
        </div>
      </div>
    </div>
  );
}

function InputWithLabel() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Input with label">
      <Input />
    </div>
  );
}

function Content3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Content">
      <p className="flex-[1_0_0] font-['DM_Sans:Regular',sans-serif] font-normal leading-[24px] min-h-px min-w-px overflow-hidden relative text-[#717680] text-[16px] text-ellipsis text-left whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14" }}>
        ••••••••
      </p>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white relative rounded-bl-[8px] rounded-br-[8px] shrink-0 w-full" data-name="Input">
      <div aria-hidden="true" className="absolute border-[#d5d7da] border-b border-l border-r border-solid inset-0 pointer-events-none rounded-bl-[8px] rounded-br-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[14px] py-[10px] relative w-full">
          <Content3 />
        </div>
      </div>
    </div>
  );
}

function InputWithLabel1() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Input with label">
      <Input1 />
    </div>
  );
}

function Form() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[9px] shrink-0 w-full" data-name="Form">
      <div aria-hidden="true" className="absolute border border-[#d5d7da] border-solid inset-0 pointer-events-none rounded-[9px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      <button className="content-stretch cursor-pointer flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Input field">
        <InputWithLabel />
      </button>
      <button className="content-stretch cursor-pointer flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Input field">
        <InputWithLabel1 />
      </button>
    </div>
  );
}

function TextPadding() {
  return (
    <div className="content-stretch flex items-center justify-center px-[2px] relative shrink-0" data-name="Text padding">
      <p className="font-['DM_Sans:Semibold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">Sign in</p>
    </div>
  );
}

function Actions() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Actions">
      <div className="bg-[#7f56d9] relative rounded-[8px] shrink-0 w-full" data-name="Buttons/Button">
        <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[6px] items-center justify-center px-[16px] py-[10px] relative w-full">
            <TextPadding />
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
        <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.12)] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]" />
      </div>
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative rounded-[12px] shrink-0 w-full" data-name="Content">
      <Form />
      <Actions />
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex items-start justify-center relative shrink-0 w-full" data-name="Row">
      <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip relative shrink-0" data-name="Buttons/Button">
        <p className="font-['DM_Sans:Semibold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#6941c6] text-[14px] whitespace-nowrap">Forgot password</p>
      </div>
    </div>
  );
}

function FooterLinks() {
  return (
    <div className="content-stretch flex flex-col h-[52px] items-center relative shrink-0 w-full" data-name="Footer links">
      <Row />
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center max-w-[360px] relative shrink-0 w-full" data-name="Content">
      <Header />
      <Content1 />
      <FooterLinks />
    </div>
  );
}

function Container() {
  return (
    <div className="max-w-[1280px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center max-w-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center max-w-[inherit] px-[32px] relative w-full">
          <Content />
        </div>
      </div>
    </div>
  );
}

export default function LogIn() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center pb-[48px] pt-[96px] relative size-full" data-name="Log in">
      <Container />
    </div>
  );
}