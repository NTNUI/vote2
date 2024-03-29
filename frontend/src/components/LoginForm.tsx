import {
  Button,
  createStyles,
  Input,
  PasswordInput,
  Select,
  TextInput,
  Notification,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { login, refreshAccessToken } from "../services/auth";
import countryCodes from "../utils/countryCodes";
import NtnuiInfoTooltip from "./Tooltip";
import { ChevronDown, Lock, Phone, World, X } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  phoneNumberWrapper: {
    width: "100%",
    marginBottom: "1rem",
    display: "grid",
    gridTemplateColumns: "0.8fr 1.2fr",
    gridTemplateRows: "1fr auto",
    gridTemplateAreas: `
        "label label"
        "country_code phone_number"
        `,
    label: {
      gridArea: "label",
      alignSelf: "center",
      color: "white",
      display: "flex",
      alignItems: "center",
      marginBottom: "5px",
    },
  },
  selectCountryCodeInput: {
    marginRight: "10px",
    color: "white",
    ".mantine-Select-rightSection": { pointerEvents: "none" },
    input: {
      gridArea: "country_code",
      backgroundColor: "transparent",
      borderRadius: "5px 5px 0 5px",
      color: "white",
      width: "100%",
      transition: "0.3s",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  numberInput: {
    input: {
      gridArea: "phone_number",
      backgroundColor: "transparent",
      color: "white",
      borderRadius: "5px 5px 0px 5px",
      width: "100%",
    },
    ".mantine-TextInput-error": {
      margin: 0,
      position: "absolute",
    },
  },
  passwordInput: {
    label: {
      color: "white",
      display: "flex",
      alignItems: "center",
      marginBottom: "5px",
      span: {
        display: "none",
      },
    },
    width: "100%",
    marginBottom: "10px",
    input: {
      backgroundColor: theme.colors.ntnui_background[0],
      color: "white",
    },
  },
  submitButton: {
    transition: "0.3s",
    width: "100%",
    margin: "1rem 0 0.5rem 0",
    backgroundColor: theme.colors.ntnui_blue[0],
    borderRadius: "5px 5px 0px 5px",
    ":hover": {
      border: "2px solid" + theme.colors.ntnui_blue[0],
      color: theme.colors.ntnui_blue[0],
      backgroundColor: "transparent",
    },
  },
  link: {
    textDecoration: "none",
    color: theme.colors.ntnui_blue[0],
  },

  loginErrorRoot: {
    backgroundColor: theme.colors.ntnui_background[0],
    borderColor: theme.colors.ntnui_red[0],
  },
  loginErrorText: {
    color: "white",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    color: "white",
  },
}));

export function LoginForm() {
  const { classes } = useStyles();
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
  };

  const form = useForm({
    initialValues: {
      country_code: "47",
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
      phone_number: "+" + values.country_code + values.phone_number,
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

  const countryCodesToSelect = countryCodes.map((code: CountryCodePair) => {
    return {
      key: code.name,
      value: code.dialCode,
      label: `(+${code.dialCode}) ${code.name}`,
    };
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => submitLoginForm(values))}
      className={classes.form}
    >
      <Input.Wrapper
        label={
          <>
            PHONE
            {NtnuiInfoTooltip(
              <>
                Log in with the same phone number you use at{" "}
                <a
                  className={classes.link}
                  href="https://medlem.ntnui.no/login"
                >
                  medlem.ntnui.no
                </a>
              </>
            )}
          </>
        }
        className={classes.phoneNumberWrapper}
      >
        <Select
          required
          aria-label="Choose country code"
          data={countryCodesToSelect}
          rightSection={<ChevronDown size={20} />}
          rightSectionWidth={30}
          icon={<World size={20} />}
          className={classes.selectCountryCodeInput}
          {...form.getInputProps("country_code")}
          data-testid="country-select"
        />
        <TextInput
          required
          type="tel"
          placeholder="Phone"
          icon={<Phone size={20} />}
          className={classes.numberInput}
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
                  className={classes.link}
                  href="https://medlem.ntnui.no/login"
                >
                  medlem.ntnui.no
                </a>
              </p>
            )}
          </>
        }
        placeholder="Password"
        icon={<Lock size={20} />}
        className={classes.passwordInput}
        {...form.getInputProps("password")}
        data-testid="password-input"
      />
      {error.active && (
        <Notification
          title="Could not log in!"
          disallowClose
          classNames={{
            root: classes.loginErrorRoot,
            title: classes.loginErrorText,
            description: classes.loginErrorText,
          }}
          onClose={() => {}}
          icon={<X size={20} />}
          color="red"
          data-testid="bad-login-notification"
        >
          {error.errorCode === 403
            ? "No active NTNUI membership found on the given user"
            : "Cannot find any user with this password and username"}
        </Notification>
      )}
      <Button
        loading={isLoading}
        uppercase
        className={classes.submitButton}
        type="submit"
        data-testid="login-button"
      >
        Log in
      </Button>
    </form>
  );
}
