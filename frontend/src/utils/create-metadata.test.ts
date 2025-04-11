import { createMetadata } from "./create-metadata";

describe("createMetadata", () => {
  // Function returns correct metadata object with default values when no parameters are provided
  it("should return metadata with default values when no parameters are provided", () => {
    // Mock CONFIG
    jest.mock("src/global-config", () => ({
      CONFIG: {
        appName: "loop",
      },
    }));

    const result = createMetadata({});

    expect(result).toEqual({
      title: "Programowanie na wyciągniecie ręki z loop • loop",
      description:
        "Ucz się programowania szybciej z AI, interaktywnymi kursami i wsparciem mentorów.",
      keywords: expect.any(String),
      alternates: {
        canonical: "https://loop.edu.pl/",
      },
      openGraph: {
        type: "website",
        url: "https://loop.edu.pl/",
        images: "https://loop.edu.pl/logo/logo.svg",
        title: "Programowanie na wyciągniecie ręki z loop • loop",
        description:
          "Ucz się programowania szybciej z AI, interaktywnymi kursami i wsparciem mentorów.",
      },
    });
  });

  // Function correctly formats title by appending appName from CONFIG
  it("should format title by appending appName from CONFIG", () => {
    // Mock CONFIG
    jest.mock("src/global-config", () => ({
      CONFIG: {
        appName: "loop",
      },
    }));

    const customTitle = "Custom Title";
    const result = createMetadata({ title: customTitle });

    expect(result.title).toBe(`${customTitle} • loop`);
    expect(result.openGraph.title).toBe(`${customTitle} • loop`);
  });

  // Function joins keywords array into comma-separated string
  it("should join keywords array into comma-separated string", () => {
    // Mock CONFIG
    jest.mock("src/global-config", () => ({
      CONFIG: {
        appName: "loop",
      },
    }));

    const customKeywords = ["keyword1", "keyword2", "keyword3"];
    const result = createMetadata({ keywords: customKeywords });

    expect(result.keywords).toBe("keyword1,keyword2,keyword3");
  });

  // Function correctly constructs canonical URL with provided path
  it("should construct canonical URL with provided path", () => {
    // Mock CONFIG
    jest.mock("src/global-config", () => ({
      CONFIG: {
        appName: "loop",
      },
    }));

    const customPath = "/test-path";
    const result = createMetadata({ path: customPath });

    expect(result.alternates.canonical).toBe(`https://loop.edu.pl${customPath}`);
  });

  // Function correctly constructs OpenGraph URL with provided path
  it("should construct OpenGraph URL with provided path", () => {
    // Mock CONFIG
    jest.mock("src/global-config", () => ({
      CONFIG: {
        appName: "loop",
      },
    }));

    const customPath = "/test-path";
    const result = createMetadata({ path: customPath });

    expect(result.openGraph.url).toBe(`https://loop.edu.pl${customPath}`);
  });

  // Function handles empty path parameter by using root path "/"
  it("should use root path when path is empty", () => {
    // Mock CONFIG
    jest.mock("src/global-config", () => ({
      CONFIG: {
        appName: "loop",
      },
    }));

    const result = createMetadata({});

    expect(result.alternates.canonical).toBe("https://loop.edu.pl/");
    expect(result.openGraph.url).toBe("https://loop.edu.pl/");
  });

  // Function handles undefined image by using default logo URL
  it("should use default logo URL when image is undefined", () => {
    // Mock CONFIG
    jest.mock("src/global-config", () => ({
      CONFIG: {
        appName: "loop",
      },
    }));

    const result = createMetadata({});

    expect(result.openGraph.images).toBe("https://loop.edu.pl/logo/logo.svg");
  });

  // Function handles empty title by using default title
  it("should use default title when title is empty", () => {
    // Mock CONFIG
    jest.mock("src/global-config", () => ({
      CONFIG: {
        appName: "loop",
      },
    }));

    const result = createMetadata({});
    const defaultTitle = "Programowanie na wyciągniecie ręki z loop";

    expect(result.title).toBe(`${defaultTitle} • loop`);
    expect(result.openGraph.title).toBe(`${defaultTitle} • loop`);
  });

  // Function handles empty description by using default description
  it("should use default description when description is empty", () => {
    // Mock CONFIG
    jest.mock("src/global-config", () => ({
      CONFIG: {
        appName: "loop",
      },
    }));

    const result = createMetadata({});
    const defaultDescription =
      "Ucz się programowania szybciej z AI, interaktywnymi kursami i wsparciem mentorów.";

    expect(result.description).toBe(defaultDescription);
    expect(result.openGraph.description).toBe(defaultDescription);
  });

  // Function handles empty keywords array
  it("should handle empty keywords array", () => {
    // Mock CONFIG
    jest.mock("src/global-config", () => ({
      CONFIG: {
        appName: "loop",
      },
    }));

    const result = createMetadata({ keywords: [] });

    expect(result.keywords).toBe("");
  });
});
