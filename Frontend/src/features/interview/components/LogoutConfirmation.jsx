import React, { useState } from "react"
import { useNavigate } from "react-router"
import { logout } from "../../auth/services/auth.api"
import "../style/logout-confirmation.scss"

const LogoutConfirmation = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await logout()
            navigate("/login")
        } catch (error) {
            console.error("Logout failed:", error)
        } finally {
            setIsLoggingOut(false)
            setIsOpen(false)
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="generate-btn"
            >
                Logout
            </button>

            {isOpen && (
                <div
                    className="logout-confirmation-backdrop"
                    onClick={() => !isLoggingOut && setIsOpen(false)}
                    onKeyDown={(event) => {
                        if (event.key === "Escape" && !isLoggingOut) {
                            setIsOpen(false)
                        }
                    }}
                    tabIndex={-1}
                >
                    <section
                        className="logout-confirmation-dialog"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="logout-dialog-title"
                        aria-describedby="logout-dialog-description"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2 id="logout-dialog-title">Are you sure?</h2>
                        <p id="logout-dialog-description">You will be logged out of your account.</p>
                        <div className="logout-confirmation-actions">
                            <button
                                type="button"
                                className="logout-cancel-btn"
                                autoFocus
                                disabled={isLoggingOut}
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="logout-confirm-btn"
                                disabled={isLoggingOut}
                                onClick={handleLogout}
                            >
                                {isLoggingOut ? "Logging out..." : "Logout"}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </>
    )
}

export default LogoutConfirmation
