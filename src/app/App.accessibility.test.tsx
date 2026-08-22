import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "./App";

const SAVED_PROFILE = {
  name: "Ana",
  height: 168,
  weight: 64,
  sex: "Feminino",
};

async function expectNoAxeViolations(container: HTMLElement) {
  expect(await axe(container)).toHaveNoViolations();
}

async function renderDashboard() {
  localStorage.setItem("nutri-profile", JSON.stringify(SAVED_PROFILE));
  const result = render(<App />);
  expect(await screen.findByRole("heading", { level: 1, name: /Olá, Ana/ })).toBeVisible();
  return result;
}

describe("acessibilidade WCAG do NutriDia", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("expõe o onboarding sem violações axe e identifica os campos opcionais", async () => {
    const { container } = render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: "Comece pelo seu perfil" })).toBeVisible();
    expect(screen.getByLabelText(/E-mail.*opcional/)).not.toBeRequired();
    expect(screen.getByLabelText(/Senha.*opcional/)).not.toBeRequired();
    await expectNoAxeViolations(container);
  });

  it("descreve o erro e move o foco para o primeiro campo inválido", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Entrar e continuar" }));

    const nameInput = screen.getByLabelText(/^Seu nome/);
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
    expect(nameInput).toHaveFocus();
    expect(screen.getByText("Informe seu nome para continuar.")).toHaveAttribute("role", "alert");
  });

  it("atualiza o título e direciona o foco ao título ao mudar de tela", async () => {
    const user = userEvent.setup();
    await renderDashboard();

    await user.click(screen.getByRole("button", { name: "Registrar" }));

    const title = await screen.findByRole("heading", { level: 1, name: "Buscar alimento" });
    expect(title).toHaveFocus();
    expect(document.title).toBe("Buscar alimento | NutriDia");
  });

  it("mantém painel, busca, detalhe e confirmação sem violações axe", async () => {
    const user = userEvent.setup();
    const { container } = await renderDashboard();
    await expectNoAxeViolations(container);

    await user.click(screen.getByRole("button", { name: "Registrar" }));
    await expectNoAxeViolations(container);

    const searchInput = screen.getByLabelText("Buscar alimento por nome");
    await user.type(searchInput, "Banana");
    expect(container.querySelector("#food-search-status")).toHaveTextContent(
      "1 alimento encontrado",
    );
    await user.click(screen.getByRole("button", { name: /Banana/ }));
    await expectNoAxeViolations(container);

    await user.click(screen.getByRole("button", { name: "Adicionar à refeição" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Registrado!" })).toBeVisible();
    await expectNoAxeViolations(container);
  });

  it("mantém cálculo, detalhe de refeição e configurações sem violações axe", async () => {
    const user = userEvent.setup();
    const { container } = await renderDashboard();

    const navigation = screen.getByRole("navigation", { name: "Navegação principal" });
    await user.click(within(navigation).getByRole("button", { name: "Cálculo" }));
    await expectNoAxeViolations(container);

    await user.click(screen.getByRole("button", { name: /Almoço 3 itens/ }));
    await expectNoAxeViolations(container);

    await user.click(within(navigation).getByRole("button", { name: "Configurações" }));
    expect(screen.getByRole("radio", { name: "Tema claro" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Alto contraste" })).not.toBeChecked();
    await expectNoAxeViolations(container);
  });
});
