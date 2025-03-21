import {
  Button,
  Input,
  PasswordInput,
  Select,
  TextInput,
  Notification,
  Box,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { login, refreshAccessToken } from "../services/auth";
import countryCodes from "../utils/countryCodes";
import NtnuiInfoTooltip from "./Tooltip";
import { ChevronDown, Lock, Phone, World, X } from "tabler-icons-react";
import { CSSProperties } from "react";

const styles = {
  phoneNumberWrapper: {
    width: "100%",
    marginBottom: rem(16),
    display: "grid",
    gridTemplateColumns: "0.8fr 1.2fr",
    gridTemplateRows: "1fr auto",
    gridTemplateAreas: `
        "label label"
        "country_code phone_number"
        `,
  } as CSSProperties,
  label: {
    gridArea: "label",
    alignSelf: "center",
    color: "white",
    display: "flex",
    alignItems: "center",
    marginBottom: rem(5),
  } as CSSProperties,
  selectCountryCodeInput: {
    marginRight: rem(10),
    color: "white",
    input: {
      gridArea: "country_code",
      backgroundColor: "transparent",
      borderRadius: `${rem(5)} ${rem(5)} 0 ${rem(5)}`,
      color: "white",
      width: "100%",
      transition: "0.3s",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  } as CSSProperties,
  numberInput: {
    input: {
      gridArea: "phone_number",
      backgroundColor: "transparent",
      color: "white",
      borderRadius: `${rem(5)} ${rem(5)} 0 ${rem(5)}`,
      width: "100%",
    },
  } as CSSProperties,
  passwordInput: {
    width: "100%",
    marginBottom: rem(10),
    label: {
      color: "white",
      display: "flex",
      alignItems: "center",
      marginBottom: rem(5),
    },
    input: {
      backgroundColor: "var(--mantine-color-ntnui-background-0)",
      color: "white",
    },
  } as CSSProperties,
  submitButton: {
    transition: "0.3s",
    width: "100%",
    margin: `${rem(16)} 0 ${rem(8)} 0`,
    backgroundColor: "var(--mantine-color-ntnui-blue-0)",
    borderRadius: `${rem(5)} ${rem(5)} 0 ${rem(5)}`,
    "&:hover": {
      border: "2px solid var(--mantine-color-ntnui-blue-0)",
      color: "var(--mantine-color-ntnui-blue-0)",
      backgroundColor: "transparent",
    },
  } as CSSProperties,
  link: {
    textDecoration: "none",
    color: "var(--mantine-color-ntnui-blue-0)",
  } as CSSProperties,
  loginErrorRoot: {
    backgroundColor: "var(--mantine-color-ntnui-background-0)",
    borderColor: "var(--mantine-color-ntnui-red-0)",
  } as CSSProperties,
  loginErrorText: {
    color: "white",
  } as CSSProperties,
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
    color: "white",
  } as CSSProperties,
};

export function LoginForm() {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ active: Boolean; errorCode?: number }>({
    active: false,
  });

  useEffect(() => {
    // Log user in and redirect if user is already logged in.
    const checkLogin = async () => {
      const isLoggedIn = await refreshAccessToken();
      if (isLoggedIn.status === 200) {
        navigate("/start");
        localStorage.setItem("isLoggedIn", "true");
      }
    };
    checkLogin();
  }, []);

  type FormValues = {
    country_code: string;
    phone_number: string;
    password: string;
  };

  type CountryCodePair = {
    name: string;
    dialCode: string;
    iso2: string;
  };

  const countryCodesToSelect = countryCodes.map((code: CountryCodePair) => {
    return {
      key: code.name,
      value: `${code.dialCode}-${code.iso2}`,
      label: `(+${code.dialCode}) ${code.name}`,
    };
  });

  const form = useForm({
    initialValues: {
      country_code: "47-no",
      phone_number: "",
      password: "",
    },

    validate: {
      phone_number: (value) =>
        !/^[0-9]{8,}$/.test(value) ? "Unvalid format" : null,
    },
  });

  const submitLoginForm = (values: FormValues) => {
    setIsLoading(true);
    const credentials = {
      phone_number: "+" + values.country_code.split("-")[0] + values.phone_number,
      password: values.password,
    };
    try {
      login(credentials.phone_number, credentials.password)
        .then(() => {
          setIsLoading(false);
          navigate("/start");
          localStorage.setItem("isLoggedIn", "true");
        })
        .catch((error) => {
          setIsLoading(false);
          setError({ active: true, errorCode: error.response.status });
          localStorage.setItem("isLoggedIn", "false");
        });
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={form.onSubmit((values) => submitLoginForm(values))} style={styles.form}>
      <Input.Wrapper
        label={
          <>
            PHONE
            {NtnuiInfoTooltip(
              <>
                Log in with the same phone number you use at{" "}
                <a
                  style={styles.link}
                  href="https://medlem.ntnui.no/login"
                >
                  medlem.ntnui.no
                </a>
              </>
            )}
          </>
        }
        style={styles.phoneNumberWrapper}
      >
        <Select
          required
          aria-label="Choose country code"
          data={countryCodesToSelect}
          rightSection={<ChevronDown size={20} />}
          rightSectionWidth={30}
          styles={{ root: styles.selectCountryCodeInput }}
          {...form.getInputProps("country_code")}
          data-testid="country-select"
        />
        <TextInput
          required
          type="tel"
          placeholder="Phone"
          styles={{ root: styles.numberInput }}
          {...form.getInputProps("phone_number")}
          onBlur={() => form.validateField("phone_number")}
          data-testid="phone-input"
        />
      </Input.Wrapper>
      <PasswordInput
        required
        autoComplete="password"
        label={
          <>
            PASSWORD
            {NtnuiInfoTooltip(
              <p>
                Log in with the same password you use at{" "}
                <a
                  style={styles.link}
                  href="https://medlem.ntnui.no/login"
                >
                  medlem.ntnui.no
                </a>
              </p>
            )}
          </>
        }
        styles={{ root: styles.passwordInput }}
        {...form.getInputProps("password")}
        data-testid="password-input"
      />
      <Button
        type="submit"
        loading={isLoading}
        style={styles.submitButton}
        data-testid="login-button"
      >
        LOG IN
      </Button>
      {error.active && (
        <Notification
          styles={{
            root: styles.loginErrorRoot,
            description: styles.loginErrorText,
          }}
          icon={<X size={18} />}
          color="red"
          onClose={() => setError({ active: false })}
        >
          {error.errorCode === 401
            ? "Wrong phone number or password"
            : "Something went wrong"}
        </Notification>
      )}
    </Box>
  );
}
