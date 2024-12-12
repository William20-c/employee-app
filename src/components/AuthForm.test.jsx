import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthForm from "./AuthForm";  

describe("AuthForm", () => {
  test("muestra el formulario de registro correctamente", () => {
    const mockSubmit = jest.fn();

    render(<AuthForm login={false} onSubmit={mockSubmit} />);

    expect(screen.getByText("Registro")).toBeInTheDocument();

    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
  });

  test("muestra el formulario de inicio de sesión correctamente", () => {
    const mockSubmit = jest.fn();

    render(<AuthForm login={true} onSubmit={mockSubmit} />);

    expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
    expect(screen.queryByLabelText("Nombre")).toBeNull();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
  });

  test("llama a onSubmit con los datos correctos en el formulario de registro", () => {
    const mockSubmit = jest.fn();

    render(<AuthForm login={false} onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "password123" } });

    fireEvent.click(screen.getByText("Registrarse"));

    expect(mockSubmit).toHaveBeenCalledWith({
      nombre: "John Doe",
      email: "john@example.com",
      password: "password123",
    });
  });

  test("llama a onSubmit con los datos correctos en el formulario de login", () => {
    const mockSubmit = jest.fn();

    render(<AuthForm login={true} onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "password123" } });

    fireEvent.click(screen.getByText("Iniciar Sesión"));

    expect(mockSubmit).toHaveBeenCalledWith({
      email: "john@example.com",
      password: "password123",
    });
  });
});
