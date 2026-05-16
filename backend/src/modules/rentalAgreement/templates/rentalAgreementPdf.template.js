const formatDateBangla = (dateString) => {
  if (!dateString) return "প্রযোজ্য নয়";

  const date = new Date(dateString);

  return date.toLocaleDateString("bn-BD", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getValue = (value, fallback = "প্রযোজ্য নয়") => {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
};

const getAgreementNumber = (booking, agreement = null) => {
  if (agreement?.agreementNo) return agreement.agreementNo;

  if (agreement?.id && agreement?.createdAt) {
    const date = new Date(agreement.createdAt);

    return `AGR-${date.getFullYear()}${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(date.getDate()).padStart(2, "0")}-${String(
      agreement.id
    ).padStart(4, "0")}`;
  }

  return `HR-BOOKING-${String(booking.id).padStart(5, "0")}`;
};

const buildAgreementViewModel = (booking, agreement = null) => {
  return {
    agreementNumber: getAgreementNumber(booking, agreement),
    createdAt: agreement?.createdAt || new Date(),
    startDate: booking.moveInDate,
    monthlyRent: booking.house?.rentAmount || 0,
    securityDeposit: booking.securityDeposit || 0,
    landlord: booking.landlord || booking.house?.landlord || {
      fullName: "প্রযোজ্য নয়",
      phone: null,
      email: null,
    },
    tenant: booking.tenant || {
      fullName: "প্রযোজ্য নয়",
      phone: null,
      email: null,
    },
    house: booking.house || {
      title: "প্রযোজ্য নয়",
      address: "প্রযোজ্য নয়",
      area: "প্রযোজ্য নয়",
      bedrooms: "প্রযোজ্য নয়",
      bathrooms: "প্রযোজ্য নয়",
    },
    booking,
  };
};

const getCommonStyles = () => {
  return `
    <style>
      @page {
        size: A4;
        margin: 0;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        background: #ffffff;
        color: #000000;
        font-family: "Nirmala UI", "Noto Sans Bengali", "SolaimanLipi", "Kalpurush", Arial, sans-serif;
        font-size: 13.5px;
        line-height: 1.35;
        letter-spacing: 0;
        word-spacing: 0;
        font-kerning: normal;
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
      }

      .page {
        width: 210mm;
        min-height: 297mm;
        padding: 34px 44px 28px 44px;
        page-break-after: always;
      }

      .page:last-child {
        page-break-after: auto;
      }

      .stamp-page {
        padding-top: 245px;
      }

      .title {
        text-align: center;
        font-size: 22px;
        font-weight: 700;
        margin: 0 0 12px 0;
      }

      .meta-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 13px;
      }

      .heading {
        font-size: 15px;
        font-weight: 700;
        margin: 9px 0 4px 0;
      }

      .line {
        margin: 0 0 2px 0;
        padding: 0;
      }

      .tenant-gap {
        margin-top: 6px;
      }

      .paragraph {
        margin: 0 0 7px 0;
        padding: 0;
        text-align: justify;
        line-height: 1.45;
      }

      .terms {
        margin: 0;
        padding-left: 18px;
      }

      .terms li {
        margin-bottom: 4px;
        line-height: 1.42;
      }

      .footer {
        text-align: center;
        margin-top: 8px;
        font-size: 12px;
      }

      .signature-wrapper {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        gap: 50px;
      }

      .signature-box {
        width: 46%;
        text-align: center;
      }

      .signature-line {
        border-top: 1px solid #000000;
        padding-top: 3px;
        font-size: 12.5px;
        font-weight: 600;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 7px;
      }

      th,
      td {
        border: 1px solid #000000;
        padding: 4px 6px;
        font-size: 12px;
        text-align: left;
        vertical-align: top;
      }

      .page-no {
        text-align: right;
        margin-top: 8px;
        font-size: 11px;
      }
    </style>
  `;
};

export const buildSinglePageAgreementHtml = (
  booking,
  options = {},
  agreementRecord = null
) => {
  const agreement = buildAgreementViewModel(booking, agreementRecord);
  const showFooter = options.showFooter ?? true;

  return `
    <!DOCTYPE html>
    <html lang="bn">
      <head>
        <meta charset="UTF-8" />
        <title>Rental Agreement Single Page</title>
        ${getCommonStyles()}
      </head>

      <body>
        <div class="page">
          <div class="title">বাড়ি ভাড়ার চুক্তিপত্র</div>

          <div class="meta-row">
            <div><strong>চুক্তি নম্বর:</strong> ${agreement.agreementNumber}</div>
            <div><strong>তারিখ:</strong> ${formatDateBangla(agreement.createdAt)}</div>
          </div>

          <div class="heading">পক্ষসমূহের তথ্য</div>
          <div class="line"><strong>বাড়ির মালিক:</strong> ${getValue(agreement.landlord.fullName)}</div>
          <div class="line"><strong>ফোন:</strong> ${getValue(agreement.landlord.phone)}</div>
          <div class="line"><strong>ইমেইল:</strong> ${getValue(agreement.landlord.email)}</div>

          <div class="line tenant-gap"><strong>ভাড়াটিয়া:</strong> ${getValue(agreement.tenant.fullName)}</div>
          <div class="line"><strong>ফোন:</strong> ${getValue(agreement.tenant.phone)}</div>
          <div class="line"><strong>ইমেইল:</strong> ${getValue(agreement.tenant.email)}</div>

          <div class="heading">বাড়ির তথ্য</div>
          <div class="line"><strong>বাড়ির নাম:</strong> ${getValue(agreement.house.title)}</div>
          <div class="line"><strong>ঠিকানা:</strong> ${getValue(agreement.house.address)}</div>
          <div class="line"><strong>এলাকা:</strong> ${getValue(agreement.house.area)}</div>
          <div class="line"><strong>মাসিক ভাড়া:</strong> ${getValue(agreement.monthlyRent)} টাকা</div>
          <div class="line"><strong>শয়নকক্ষ:</strong> ${getValue(agreement.house.bedrooms)}</div>
          <div class="line"><strong>বাথরুম:</strong> ${getValue(agreement.house.bathrooms)}</div>
          <div class="line"><strong>বাসা গ্রহণের তারিখ:</strong> ${formatDateBangla(agreement.startDate)}</div>

          <div class="heading">আবেদন ও বুকিং তথ্য</div>
          <div class="line"><strong>বুকিং স্ট্যাটাস:</strong> ${getValue(agreement.booking.status)}</div>
          <div class="line"><strong>আবেদন স্ট্যাটাস:</strong> ${getValue(agreement.booking.applicationStatus || "PENDING")}</div>
          <div class="line"><strong>আবেদনের তারিখ:</strong> ${formatDateBangla(agreement.booking.createdAt)}</div>
          <div class="line"><strong>বুকিং বার্তা:</strong> ${getValue(agreement.booking.message)}</div>
          <div class="line"><strong>আবেদনের নোট:</strong> ${getValue(agreement.booking.landlordNote)}</div>
          <div class="line"><strong>সিকিউরিটি ডিপোজিট:</strong> ${getValue(agreement.securityDeposit)} টাকা</div>

          <div class="heading">শর্তাবলি</div>
          <ol class="terms">
            <li>ভাড়াটিয়া প্রতি মাসের নির্ধারিত সময়ের মধ্যে বাড়ি ভাড়া পরিশোধ করতে বাধ্য থাকবেন।</li>
            <li>বাড়ির মালিক ভাড়াটিয়াকে বসবাসের উপযোগী পরিবেশ প্রদান করবেন।</li>
            <li>বাড়ির স্বাভাবিক ব্যবহার ব্যতীত ভাড়াটিয়ার কারণে কোনো ক্ষতি হলে তার দায় ভাড়াটিয়ার উপর বর্তাবে।</li>
            <li>বাড়িতে কোনো অবৈধ কার্যকলাপ করা যাবে না।</li>
            <li>উভয় পক্ষের সম্মতি ও প্রচলিত নিয়ম অনুযায়ী এই চুক্তি কার্যকর থাকবে।</li>
          </ol>

          ${
            showFooter
              ? `<div class="footer">এটি একটি সিস্টেম জেনারেটেড চুক্তিপত্র।</div>`
              : ""
          }

          <div class="signature-wrapper">
            <div class="signature-box">
              <div class="signature-line">বাড়ির মালিকের স্বাক্ষর</div>
            </div>
            <div class="signature-box">
              <div class="signature-line">ভাড়াটিয়ার স্বাক্ষর</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const buildStamp3PageAgreementHtml = (
  booking,
  options = {},
  agreementRecord = null
) => {
  const agreement = buildAgreementViewModel(booking, agreementRecord);
  const showFooter = options.showFooter ?? true;

  return `
    <!DOCTYPE html>
    <html lang="bn">
      <head>
        <meta charset="UTF-8" />
        <title>Rental Agreement Stamp 3 Page</title>
        ${getCommonStyles()}
      </head>

      <body>
        <div class="page stamp-page">
          <div class="title">বাড়ি ভাড়ার চুক্তিপত্র</div>

          <div class="paragraph">এই মর্মে জানানো যাচ্ছে যে, ${getValue(agreement.landlord.fullName)} (বাড়ির মালিক) এবং ${getValue(agreement.tenant.fullName)} (ভাড়াটিয়া)-এর মধ্যে নিম্নে বর্ণিত শর্তাবলির ভিত্তিতে ${getValue(agreement.house.title)} নামক বাড়ি/ফ্ল্যাট ভাড়ার জন্য এই চুক্তিপত্র সম্পাদিত হলো।</div>

          <div class="paragraph">উক্ত বাড়ির ঠিকানা ${getValue(agreement.house.address)}, এলাকা ${getValue(agreement.house.area)}। ভাড়াটিয়া ${formatDateBangla(agreement.startDate)} তারিখ হতে উক্ত বাড়িতে বসবাসের অধিকার লাভ করবেন এবং প্রতি মাসে ${getValue(agreement.monthlyRent)} টাকা ভাড়া প্রদান করবেন।</div>

          <div class="paragraph">উভয় পক্ষের পরিচয়, আবেদন, বুকিং এবং বাড়ির প্রাথমিক তথ্য নিচের টেবিলে উল্লেখ করা হলো।</div>

          <table>
            <tr><th>বিষয়</th><th>তথ্য</th></tr>
            <tr><td>চুক্তি নম্বর</td><td>${agreement.agreementNumber}</td></tr>
            <tr><td>বাড়ির মালিক</td><td>${getValue(agreement.landlord.fullName)}</td></tr>
            <tr><td>ভাড়াটিয়া</td><td>${getValue(agreement.tenant.fullName)}</td></tr>
            <tr><td>ফোন</td><td>${getValue(agreement.tenant.phone)}</td></tr>
            <tr><td>মাসিক ভাড়া</td><td>${getValue(agreement.monthlyRent)} টাকা</td></tr>
          </table>

          <div class="page-no">পৃষ্ঠা নং -০১</div>
        </div>

        <div class="page stamp-page">
          <div class="heading">বিস্তারিত শর্তাবলি</div>

          <div class="paragraph">১। ভাড়াটিয়া প্রতি মাসের নির্ধারিত সময়ের মধ্যে ভাড়া প্রদান করবেন। ভাড়া প্রদানে বিলম্ব হলে বাড়ির মালিক প্রয়োজনীয় সিদ্ধান্ত গ্রহণ করতে পারবেন।</div>
          <div class="paragraph">২। বাড়ির মালিক ভাড়াটিয়াকে বসবাসযোগ্য পরিবেশ প্রদান করবেন এবং পূর্ব অনুমতি ছাড়া ভাড়াটিয়ার স্বাভাবিক বাসস্থানের অধিকারে অযথা হস্তক্ষেপ করবেন না।</div>
          <div class="paragraph">৩। বাড়ির কোনো অংশ ইচ্ছাকৃতভাবে নষ্ট করা, অবৈধ কাজে ব্যবহার করা বা অন্যের কাছে সাবলেট দেয়া যাবে না, যদি না বাড়ির মালিক লিখিত সম্মতি প্রদান করেন।</div>
          <div class="paragraph">৪। ভাড়াটিয়া বাসার বিদ্যুৎ, গ্যাস, পানি, ইন্টারনেট বা অন্যান্য ব্যবহারজনিত বিল পারস্পরিক সমঝোতা অনুযায়ী বহন করবেন।</div>
          <div class="paragraph">৫। এই চুক্তির সাথে সংশ্লিষ্ট বুকিং বার্তা: ${getValue(agreement.booking.message)}।</div>
          <div class="paragraph">৬। আবেদনকারীর নোট: ${getValue(agreement.booking.landlordNote)}।</div>

          <div class="page-no">পৃষ্ঠা নং -০২</div>
        </div>

        <div class="page stamp-page">
          <div class="heading">চূড়ান্ত ঘোষণা</div>

          <div class="paragraph">আমরা উভয় পক্ষ এই মর্মে ঘোষণা করছি যে, উপরোক্ত সকল তথ্য সঠিক এবং উল্লিখিত শর্তাবলি বুঝে এই চুক্তিতে সম্মতি প্রদান করলাম।</div>
          <div class="paragraph">চুক্তি তৈরির তারিখ: ${formatDateBangla(agreement.createdAt)}।</div>
          <div class="paragraph">সিকিউরিটি ডিপোজিট: ${getValue(agreement.securityDeposit)} টাকা।</div>
          <div class="paragraph">বাড়ির তথ্য: ${getValue(agreement.house.title)}, ${getValue(agreement.house.address)}, ${getValue(agreement.house.area)}।</div>

          ${
            showFooter
              ? `<div class="footer">এটি একটি সিস্টেম জেনারেটেড চুক্তিপত্র।</div>`
              : ""
          }

          <div class="signature-wrapper">
            <div class="signature-box">
              <div class="signature-line">বাড়ির মালিকের স্বাক্ষর</div>
            </div>
            <div class="signature-box">
              <div class="signature-line">ভাড়াটিয়ার স্বাক্ষর</div>
            </div>
          </div>

          <div class="page-no">পৃষ্ঠা নং -০৩</div>
        </div>
      </body>
    </html>
  `;
};